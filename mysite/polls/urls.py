from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.index, name='index'),
    path('postcard/', views.postcard, name='postcard'),
    path('test_ajax/', views.test_ajax, name='ajax'),
    path('formset_test', views.formset_test, name='formset_test'),
    path('form_creation/<int:id>/', views.form_creation, name='form_creation'),
    path('form_creation/<int:id>/save_config/', views.form_save_config, name='form_save_config'),
    path('form_creation/<int:id>/get_configuration/', views.form_get_config, name='form_get_config'),
    path('task_emplementation/<int:id>/get_configureation', views.task_get_config, name='task_get_config'),
    path('organization/<int:org_id>', views.orgranization, name='organization'),
    path('change_order_balance/<int:order_id>', views.change_order_balance, name='change_order_balance'),
    path('top_up_balance/<int:org_id>', views.top_up_balance, name='top_up_balance')
]
