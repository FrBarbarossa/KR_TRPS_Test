from django.shortcuts import render
from .models import Person
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.db.utils import IntegrityError
from django.forms import formset_factory
from .forms import *
from django.contrib.auth.decorators import login_required, permission_required


@login_required
@permission_required(["users.can_create_tasks", ],
                     raise_exception=True)  # Всё, что в списке - необходимые одновременно разрешения
def index(request):
    return render(request, 'polls/index.html')


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
        pass
        # formSet = formset_factory(SurnameForm, extra=4)
    if request.method == "POST":
        print(request.POST)
        # return JsonResponse({'status': 'Invalid request', "some_param": True}, status=200)
        # formSet = formset_factory(NameForm, SurnameForm, extra=4)
    return render(request, 'polls/form_test.html')

# Create your views here.
