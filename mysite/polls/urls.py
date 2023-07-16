from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name='index'),
    path('postcard/', views.postcard, name='postcard')
]
