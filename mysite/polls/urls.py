from django.urls import path

from . import views

app_name = "polls"

urlpatterns = [
    path('', views.index, name='index'),
    path('postcard/', views.postcard, name='postcard'),
    path('test_ajax/', views.test_ajax, name='ajax'),
    path('formset_test', views.formset_test, name='formset_test'),
    path('create_new_form/<int:order_id>', views.create_new_form, name='create_new_form'),
    path('make_active_form/<int:form_id>', views.make_active_form, name='make_active_form'),
    path('form_creation/<int:id>/', views.form_creation, name='form_creation'),
    path('form_creation/<int:id>/save_config/', views.form_save_config, name='form_save_config'),
    path('form_creation/<int:id>/save_duration_rep_config/', views.form_save_duration_rep_config, name='form_save_duration_rep_config'),
    path('form_creation/<int:id>/get_configuration/', views.form_get_config, name='form_get_config'),
    path('download_form_data/<int:form_id>', views.download_form_data, name='download_form_data'),
    path('organization/<int:org_id>', views.orgranization, name='organization'),
    path('create_organization', views.create_organization, name='create_organization'),
    path('change_order_balance/<int:order_id>', views.change_order_balance, name='change_order_balance'),
    path('top_up_balance/<int:org_id>', views.top_up_balance, name='top_up_balance'),
    path('get_order_transactions/<int:order_id>', views.get_order_transactions, name='get_order_transactions'),
    path('order/<int:order_id>', views.order, name='order'),
    path('create_order/<int:org_id>', views.create_order, name='create_order'),
    path('change_order_status/<int:order_id>/<str:status>', views.change_order_status, name='change_order_status'),
    path('change_source_status/<str:source_name>', views.change_source_status, name='change_source_status'),
    path('get_filtered_orders/', views.get_filtered_orders, name='get_filtered_orders'),
    path('tasks', views.tasks, name='tasks'),
    path('get_order_instruction/<int:order_id>', views.get_order_instruction, name='get_order_instruction'),
    path('create_task/<int:order_id>', views.create_task, name='create_task'),
    path('task_implementation/<int:task_id>', views.task_implementation, name='task_implementation'),
    path('task_implementation/save_form_answer/<int:task_id>', views.save_form_answer, name='save_form_answer'),
    path('task_imlementation/complete_task/<int:task_id>', views.complete_task, name='complete_task'),
    path('change_profile_balance', views.change_profile_balance, name='change_profile_balance')
]
