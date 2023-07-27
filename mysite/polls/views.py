from django.shortcuts import render
from .models import Person
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.db.utils import IntegrityError
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
    return JsonResponse({'status': 'Invalid request', "some_param": True}, status=200)
# Create your views here.
