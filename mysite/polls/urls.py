from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name='index'),
    path('postcard/', views.postcard, name='postcard'),
    path('test_ajax/', views.test_ajax, name='ajax'),
    path('formset_test', views.formset_test, name='formset_test'),
    path('form_creation', views.form_creation, name='form_creation')
]
