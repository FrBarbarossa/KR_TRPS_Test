import datetime

from django.shortcuts import render
from polls.models import *
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.db.utils import IntegrityError
from django.forms import formset_factory
from .forms import *
from .models import *
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.decorators import login_required, permission_required
import json
import zipfile
from .forms import OrgForm
from django.core.files.base import ContentFile
from django.core.exceptions import PermissionDenied
from django.core import serializers


@login_required
@permission_required(["users.can_create_tasks", ],
                     raise_exception=True)  # Всё, что в списке - необходимые одновременно разрешения
def index(request):
    return render(request, 'polls/index.html')


@login_required
def orgranization(request, org_id):
    # Проверка, что организация принадлежит пользователю
    if not Organization.objects.filter(id=org_id):
        raise PermissionDenied()
    if org_id != Organization.objects.filter(profile=request.user.profile)[0].id:
        raise PermissionDenied()
    if request.method == "POST":
        org_form = OrgForm(request.POST, instance=Organization.objects.get(profile=request.user.profile))
        if org_form.is_valid():
            print('ITS VALID!')
            print(org_form.cleaned_data)
            return HttpResponseRedirect(reverse("polls:organization", kwargs={"org_id": org_id}))
    else:
        org_form = OrgForm(instance=Organization.objects.get(profile=request.user.profile))
    orders = Order.objects.filter(org_id=org_id)
    organization = Organization.objects.get(id=org_id)
    return render(request, 'polls/organization.html',
                  {'org_form': org_form, "orders": orders, 'organization': organization})


def top_up_balance(request, org_id):
    if not Organization.objects.filter(id=org_id) or not Organization.objects.filter(profile=request.user.profile):
        raise PermissionDenied()
    if org_id != Organization.objects.filter(profile=request.user.profile)[0].id:
        raise PermissionDenied()
    organization = Organization.objects.get(id=org_id)
    organization.balance += 500
    organization.save()
    return JsonResponse(data={'organization': organization.balance}, status=200)


def change_order_balance(request, order_id):
    if not Order.objects.filter(id=order_id) or not Organization.objects.filter(profile=request.user.profile):
        raise PermissionDenied()
    if Organization.objects.get(profile=request.user.profile) == Order.objects.get(id=order_id).org:
        delta = json.load(request)['delta']
        print(delta)

        order = Order.objects.get(id=order_id)
        print(order.org.balance)
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

        # new_balance = json.load(request)['delta']
        # print(request.user, order_id, json.load(request)['delta'])
        return JsonResponse(data={"orders": orders, 'organization': organization}, status=200)


def postcard(request):
    print(request.POST['pername'])
    print(request.POST)

    # print(request.session['name'])
    # request.session.set_expiry(10)
    # request.session.clear_expired()
    request.session['name'] = "Alex"
    # print(Person.objects.get(pk="2").name)
    try:
        Person(name=request.POST['pername']).save()
    except IntegrityError as error:
        print(error)
    return HttpResponseRedirect(reverse("polls:index"))


def test_ajax(request):
    print("!!!!!")
    print(request.headers.get('x-requested-with') == 'XMLHttpRequest')  # Check if request is ajax
    return JsonResponse({'status': 'Invalid request', "some_param": True}, status=200)


def formset_test(request):
    print("In formset_test")
    if request.method == "GET":
        # joe = Author.objects.create(name="Joe")
        # Organization(name='test_org2', profile_id=4, balance=0).save()
        # Order(org_id=Organization.objects.get(id=1), balance=100, task_cost=0.02).save()
        # Form(order_id=1, is_active=True, duration=datetime.timedelta(minutes=15), repeat_times=5, data=[{'type': 'chose', 'question': 'Other sample',
        #                                                                    'attributes': {'feature_name': 'sample2',
        #                                                                                   'required': True,
        #                                                                                   'random': True},
        #                                                                    'additional_elements': ['Ответ_0', 'Ответ_1',
        #                                                                                            'Ответ_2',
        #                                                                                            'Ответ_3']},
        #                                                                   {'type': 'chose', 'question': 'Test',
        #                                                                    'attributes': {
        #                                                                        'feature_name': 'sample',
        #                                                                        'required': True,
        #                                                                        'random': False},
        #                                                                    'additional_elements': ['Ответ_0',
        #                                     'Ответ_1',
        #                                                                                            'Ответ_2',
        #                                                                                            'Ответ_3']},
        #                                                                   {'type': 'chose', 'question': 'Ваш вопрос1',
        #                                                                    'attributes': {},
        #                                                                    'additional_elements': []}]).save()
        pass
        # formSet = formset_factory(SurnameForm, extra=4)
    if request.method == "POST":
        if request.FILES['myFile'].content_type == 'application/zip':
            with zipfile.ZipFile(request.FILES['myFile'], 'r') as myzip:
                for filename in myzip.namelist()[1:]:
                    with myzip.open(filename) as myfile:
                        print(zipfile.Path(myzip, filename).name)  # arcname/picture.jpeg -> picture.jpeg
                        # name = f"order_{order_id}/" + zipfile.Path(myzip, filename).name
                        # Source(file_link=ContentFile(myfile.read(), name="order_1/"+zipfile.Path(myzip, filename).name), s_type="IM", order=Order.objects.get(id=1), repeat_time_plan=2,
                        #        repeat_time_fact=0).save()

        # Source.objects.filter(order_id = 1).delete()
        # Source(file_link=request.FILES['myFile'], s_type="IM", order=Order.objects.get(id=1),repeat_time_plan=2, repeat_time_fact=0).save()
        # return JsonResponse({'status': 'Invalid request', "some_param": True}, status=200)
        # formSet = formset_factory(NameForm, SurnameForm, extra=4)
    return render(request, 'polls/form_test.html')


def form_creation(request, id):
    return render(request, 'polls/form_creation.html')


# Поменять, когда будет модель!!!! Если есть по данному id уже существующая форма - отдать её
def form_get_config(request, id):
    # Пример даннных, которые должна отдать модель (или не отдать ничего)
    data = [{'type': 'chose', 'question': 'Other sample',
             'attributes': {'feature_name': 'sample2', 'required': True, 'random': True},
             'additional_elements': ['Ответ_0', 'Ответ_1', 'Ответ_2', 'Ответ_3']}, {'type': 'chose', 'question': 'Test',
                                                                                    'attributes': {
                                                                                        'feature_name': 'sample',
                                                                                        'required': True,
                                                                                        'random': False},
                                                                                    'additional_elements': ['Ответ_0',
                                                                                                            'Ответ_1',
                                                                                                            'Ответ_2',
                                                                                                            'Ответ_3']},
            {'type': 'chose', 'question': 'Ваш вопрос1', 'attributes': {}, 'additional_elements': []}]
    # data = None
    return JsonResponse({"data": data}, status=200)


def form_save_config(request, id):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        print(json.load(request))
        print(request.user.id)
    return JsonResponse({'status': 'Gotcha', "some_param": True}, status=200)


# Получить конфигурацию задания для формирования формы с ответами. При перезагрузке отрисуются только те, у которых статус "не выполнены"
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

# Create your views here.
