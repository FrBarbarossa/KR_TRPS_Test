import csv
from django.shortcuts import render, redirect
from django.db.models import F
from polls.models import *
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.db.utils import IntegrityError
from .forms import *
from .models import *
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
import json
import zipfile
import filetype
from .forms import OrgForm
from django.core.files.base import ContentFile
from django.core.exceptions import PermissionDenied
from django.core import serializers
from .tasks import add, complete_task_timeout
from django.db import connection


@login_required
@permission_required(["users.can_create_tasks", ],
                     raise_exception=True)  # Всё, что в списке - необходимые одновременно разрешения
def index(request):
    return render(request, 'polls/index.html')


@login_required
def change_profile_balance(request):
    profile = request.user.profile
    profile.balance = 0
    profile.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required
def orgranization(request, org_id):
    if not Organization.objects.filter(id=org_id):
        raise PermissionDenied()
    if org_id != Organization.objects.filter(profile=request.user.profile)[0].id:
        raise PermissionDenied()
    if request.method == "POST":
        org_form = OrgForm(request.POST, instance=Organization.objects.get(profile=request.user.profile))
        if org_form.is_valid():
            org_form.save()
            return HttpResponseRedirect(reverse("polls:organization", kwargs={"org_id": org_id}))
    else:
        org_form = OrgForm(instance=Organization.objects.get(profile=request.user.profile))
    orders = Order.objects.filter(org_id=org_id).order_by('org_id')
    organization = Organization.objects.get(id=org_id)
    return render(request, 'polls/organization.html',
                  {'org_form': org_form, "orders": orders, 'organization': organization})


@login_required
def create_organization(request):
    org = Organization(name=request.user.username + "`s_organization", profile=request.user.profile, balance=0)
    org.save()
    return HttpResponseRedirect(reverse("polls:organization", kwargs={'org_id': org.id}))


@login_required
def top_up_balance(request, org_id):
    if not Organization.objects.filter(id=org_id) or not Organization.objects.filter(profile=request.user.profile):
        raise PermissionDenied()
    if org_id != Organization.objects.filter(profile=request.user.profile)[0].id:
        raise PermissionDenied()
    organization = Organization.objects.get(id=org_id)
    organization.balance += 500
    organization.save()
    return JsonResponse(data={'organization': organization.balance}, status=200)


@login_required
def change_order_balance(request, order_id):
    if not Order.objects.filter(id=order_id) or not Organization.objects.filter(profile=request.user.profile):
        raise PermissionDenied()
    if Organization.objects.get(profile=request.user.profile) == Order.objects.get(id=order_id).org:
        delta = json.load(request)['delta']

        order = Order.objects.get(id=order_id)
        if delta > 0:
            if order.org.balance >= delta:
                order.org.balance -= delta
                order.balance += delta
            if order.org.balance < delta:
                order.balance += order.org.balance
                order.org.balance = 0
        if delta < 0:
            if order.balance >= abs(delta):
                order.balance += delta
                order.org.balance += abs(delta)
            else:
                order.org.balance += order.balance
                order.balance = 0
        order.save()
        order.org.save()
        orders = serializers.serialize('json', Order.objects.filter(org=Order.objects.get(id=order_id).org),
                                       fields=['io', 'balance'])
        organization = order.org.balance
        return JsonResponse(data={"orders": orders, 'organization': organization}, status=200)


@login_required
def get_order_transactions(request, order_id):
    spent = sum(Transaction.objects.filter(status='DN').select_related('task').filter(
        task__form__order_id=order_id).values_list('res_sum', flat=True))
    reserved = sum(Transaction.objects.filter(status='RS').select_related('task').filter(
        task__form__order_id=order_id).values_list('res_sum', flat=True))
    balance = Order.objects.get(id=order_id).balance
    last_hunderd_trans = list(Transaction.objects.filter().select_related('task').filter(
        task__form__order_id=order_id).order_by('modified_at').values_list('modified_at', "res_sum", "status")[:50])
    return JsonResponse(
        data={"spent": spent, "reserved": reserved, "balance": balance, "last_transactions": last_hunderd_trans},
        status=200)


@login_required
def order(request, order_id):
    if Order.objects.get(id=order_id).org.profile.user != request.user:
        raise PermissionDenied()
    order = Order.objects.get(id=order_id)
    sources = list(
        Source.objects.order_by('source_file_name', "id").distinct('source_file_name').filter(order=order).values(
            'source_file_name', 'status'))
    forms = list(Form.objects.filter(order=order).order_by('id').values())
    for i in range(len(forms)):
        form_id = forms[i]['id']
        tasks = Task.objects.filter(form=Form.objects.get(id=form_id))
        length = 0
        for j in tasks:
            length += len(j.answer_set.all())
        forms[i]['answers'] = length
    if request.method == "POST":
        if request.FILES:
            if request.FILES['myFile'].content_type == 'application/zip':
                with zipfile.ZipFile(request.FILES['myFile'], 'r') as myzip:
                    archive_name = f'{myzip.filename}_{str(datetime.datetime.now())}'
                    first_name_part = f"order_{order_id}/{archive_name}/"
                    for filename in myzip.namelist()[1:]:
                        with myzip.open(filename) as myfile:
                            name = first_name_part + zipfile.Path(myzip, filename).name
                            mime = filetype.guess(myfile).mime
                            if mime.startswith('image'):
                                s_type = 'IM'
                            elif mime.startswith('audio'):
                                s_type = 'VD'
                            Source(file_link=ContentFile(myfile.read(), name=name), source_file_name=archive_name,
                                   s_type=s_type, order=Order.objects.get(id=order_id), repeat_time_plan=2,
                                   repeat_time_fact=0).save()
        form = OrderForm(request.POST, instance=order)
        if form.is_valid():
            form.save(commit=True)
    else:
        form = OrderForm(instance=order)
    order.save()
    return render(request, 'polls/order.html', {"order": order,
                                                "form": form,
                                                'forms': forms,
                                                'sources': sources})


@login_required
def change_source_status(request, source_name):
    source = Source.objects.filter(source_file_name=source_name)
    if 'status' in request.POST:
        source.update(status='OG')
    else:
        source.update(status='ST')
    source[0].order.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required
def create_order(request, org_id):
    order = Order(org_id=org_id, balance=0, task_cost=0, name='Задание на разметку')
    order.save()
    return HttpResponseRedirect(reverse("polls:order", kwargs={'order_id': order.id}))


@login_required
def change_order_status(request, order_id, status):
    order = Order.objects.get(id=order_id)
    if status == 'CR':
        order.status = 'PB'
    if status == "PB":
        order.status = 'CR'
    order.save()
    return HttpResponseRedirect(reverse("polls:order", kwargs={'order_id': order_id}))


# Создать новую форму для заказа
@login_required
def create_new_form(request, order_id):
    form = Form(order_id=order_id, is_active=False, duration=datetime.timedelta(minutes=15), repeat_times=1)
    form.save()
    return HttpResponseRedirect(reverse("polls:form_creation", kwargs={'id': form.id}))


@login_required
def make_active_form(request, form_id):
    form = Form.objects.get(id=form_id)
    order = form.order
    for f in order.form_set.all():
        f.is_active = False
        f.save()
    form.is_active = True
    form.save()
    return HttpResponseRedirect(reverse("polls:order", kwargs={'order_id': order.id}))


@login_required
def form_creation(request, id):
    return render(request, 'polls/form_creation.html', {"id": id})


@login_required
def form_get_config(request, id):
    if Form.objects.get(id=id).order.org.profile.user != request.user:
        raise PermissionDenied()
    status = 'Ok'
    if len(Task.objects.filter(form_id=id)) > 0:
        status = 'Cant be edit'
    data = list(Form.objects.filter(id=id).values('data'))[0]['data']
    duration = Form.objects.get(id=id).duration
    duration_str = f'{duration.seconds // 60}:{duration.seconds % 60}'
    repeat_times = Form.objects.get(id=id).repeat_times
    return JsonResponse({"status": status, "data": data, "duration": duration_str, "repeat_times": repeat_times},
                        status=200)


@login_required
def form_save_config(request, id):
    if Form.objects.get(id=id).order.org.profile.user != request.user:
        raise PermissionDenied()
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if len(Task.objects.filter(form_id=id)) > 0:
            return JsonResponse({'status': 'Cant be edit', "some_param": False}, status=200)
        form = Form.objects.get(id=id)
        form.data = json.load(request)
        form.save()
    return JsonResponse({'status': 'Gotcha', "some_param": True}, status=200)


@login_required
def form_save_duration_rep_config(request, id):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        form = Form.objects.get(id=id)
        req_info = json.load(request)
        form.duration = req_info['duration']
        form.repeat_times = req_info['repeats']
        form.save()
    return JsonResponse({'status': 'Gotcha', "some_param": True}, status=200)


@login_required
def download_form_data(request, form_id):
    answers = Task.objects.filter(form_id=form_id).select_related("answer").select_related(
        'res_source_id').select_related('source').filter(
        answer__task_id__isnull=False).values(
        'answer__task_id', 'answer__data', 'answer__executor_id', 'answer__res_source__source__file_link')
    response = HttpResponse(
        content_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="results_form_{form_id}_{str(datetime.datetime.now())}.csv"'},
    )
    form = Form.objects.get(id=form_id)
    headers_line = ['executor_id', 'source_file_name']
    for quest in form.data:
        if "feature_name" in quest['attributes'].keys():
            headers_line.append(quest['attributes']['feature_name'])
        else:
            headers_line.append(quest['question'])

    writer = csv.writer(response)
    writer.writerow(headers_line)
    for answer in answers:
        writer.writerow(
            [answer['answer__executor_id']] + [answer['answer__res_source__source__file_link'].split('/')[-1]] + answer[
                'answer__data'])
    return response


# Получить конфигурацию задания для формирования формы с ответами. При перезагрузке отрисуются только те, у которых статус "не выполнены"
@login_required
def task_get_config(request, id):
    # Тут запрос в БД
    data = {"reserved_sources": [{'id': 1, "source": 'link/href', 'status': "created"}],
            "form": [{'type': 'chose', 'question': 'Other sample',
                      'attributes': {'feature_name': 'sample2', 'required': True, 'random': True},
                      'additional_elements': ['Ответ_0', 'Ответ_1', 'Ответ_2', 'Ответ_3']},
                     {'type': 'chose', 'question': 'Test',
                      'attributes': {
                          'feature_name': 'sample',
                          'required': True,
                          'random': False},
                      'additional_elements': ['Ответ_0',
                                              'Ответ_1',
                                              'Ответ_2',
                                              'Ответ_3']},
                     {'type': 'chose', 'question': 'Ваш вопрос1', 'attributes': {}, 'additional_elements': []}],
            "startData": "16.08.2023 17:00"}
    return JsonResponse({'data': data}, status=200)


@login_required
def get_filtered_orders(request):
    orders_ids = []
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        orgs_ids = json.load(request)['orgs_ids']
    forms = list(Form.objects.filter(is_active=True).select_related('order').filter(order__org_id__in=orgs_ids,
                                                                                    order__status="PB",
                                                                                    order__balance__gt=F(
                                                                                        'order__task_cost')).values(
        'duration', 'order__name', 'order__description', 'order__org__name',
        'order__task_cost', 'order__created_at', 'id', 'order_id'))
    return JsonResponse({'status': "Ok", "orders": forms}, status=200)


@login_required
def tasks(request):
    organizations = Organization.objects.filter(status='CR')
    not_finished_tasks = Task.objects.all().annotate(
        max_end_data=F('start_DateTime') + F('form__duration')
    ).filter(max_end_data__gte=datetime.datetime.now(datetime.timezone.utc))

    return render(request, 'polls/tasks.html', {"organizations": organizations, "nf_tasks": not_finished_tasks})


@login_required
def get_order_instruction(request, order_id):
    instr = Order.objects.get(id=order_id).instruction
    return JsonResponse({'status': "Ok", "instruction": instr}, status=200)


@login_required
def create_task(request, order_id):
    form = Form.objects.get(order_id=order_id, is_active=True)
    sources = Source.objects.filter(order_id=order_id, status='OG', repeat_time_plan__gt=F('repeat_time_fact'))[
              :form.repeat_times]
    if len(sources) < form.repeat_times:
        form.order.status = 'ND'
        form.order.save()
        messages.warning(request, 'К сожалению, нет заданий на разметку.')
        return HttpResponseRedirect(reverse("polls:tasks"))
    task = Task(executor_id=request.user.profile.id, form=form, status='ST')
    task.save()
    complete_task_timeout.apply_async((task.id, request.user.profile.id), countdown=form.duration.seconds)
    order = form.order
    transaction = Transaction(org_id=order.org.id, task_id=task.id, res_sum=order.task_cost, status='RS')
    transaction.save()
    order.balance -= order.task_cost
    order.save()
    for choosed_source in sources:
        # choosed_source = random.choice(sources)
        choosed_source.repeat_time_fact += 1
        choosed_source.save()
        rs = ReservedSource(source=choosed_source, task=task, status="RD")
        rs.save()
        print(rs)
    return HttpResponseRedirect(reverse("polls:task_implementation", kwargs={"task_id": task.id}))


@login_required
def task_implementation(request, task_id):
    sources = ReservedSource.objects.filter(task_id=task_id)
    task = Task.objects.get(id=task_id)
    form = task.form
    answers = list(map(lambda x: tuple(x.values())[0], Answer.objects.filter(task_id=task_id).values('res_source_id')))

    if (task.start_DateTime + form.duration) <= datetime.datetime.now(datetime.timezone.utc):
        messages.warning(request, 'Время выполнения задания истекло')
        return HttpResponseRedirect(reverse("polls:tasks"))

    delta = abs(datetime.datetime.now(datetime.timezone.utc) - (task.start_DateTime + form.duration))
    duration = f'{delta.seconds // 3600}:{delta.seconds // 60}:{delta.seconds % 60}'
    return render(request, 'polls/form_implementation.html',
                  {"sources": sources, "form": form, 'task': task, "answers": answers, "duration": duration})


@login_required
def save_form_answer(request, task_id):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        executor = request.user.profile.id
        data = json.load(request)
        res_source = list(data.keys())[0]
        answ_data = data[res_source]
        print(res_source, answ_data)
        answers = Answer.objects.filter(executor_id=executor, task_id=task_id, res_source_id=res_source)
        if answers:
            answers[0].data = answ_data
            answers[0].save()
        else:
            neo_answer = Answer(executor_id=executor, task_id=task_id, res_source_id=res_source, data=answ_data)
            neo_answer.save()
        ReservedSource.objects.filter(id=res_source).update(status='DN')
        return JsonResponse({'status': "Ok"}, status=200)
        # print(json.load(request))


@login_required
def complete_task(request, task_id):
    task = Task.objects.get(id=task_id)
    if task.form.repeat_times == len(task.answer_set.all()):
        transaction = Transaction.objects.get(task_id=task_id)
        transaction.status = 'DN'
        transaction.save()
        request.user.profile.balance += transaction.res_sum
        request.user.profile.save()
        task.status = 'DN'
        task.end_DateTime = datetime.datetime.now(datetime.timezone.utc)
        task.save()
        return JsonResponse({'status': "Ok"}, status=200)
    else:
        return JsonResponse({'status': "Not done"}, status=200)


def view_404(request, exception=None):
    messages.warning(request, 'Запрашиваемая страница не найдена или удалена администрацией')
    return redirect('/')
