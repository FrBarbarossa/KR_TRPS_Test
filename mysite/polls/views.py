from django.shortcuts import render
from .models import Person
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.db.utils import IntegrityError
def index(request):
    return render(request, 'polls/index.html')

def postcard(request):
    print(request.POST['pername'])
    print("!")
    print(Person.objects.get(pk="2").name)
    try:
        Person(name=request.POST['pername']).save()
    except IntegrityError:
        pass
    return HttpResponseRedirect(reverse("polls:index"))
# Create your views here.
