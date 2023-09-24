from django.contrib import admin
from django.utils.safestring import mark_safe
from django_admin_listfilter_dropdown.filters import DropdownFilter, RelatedDropdownFilter, ChoiceDropdownFilter
from admin_auto_filters.filters import AutocompleteFilter

from .models import *
from users.models import Profile


class OrderAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Organization name'  # display title
        field_name = 'org'  # name of the foreign key field

    search_fields = ['id']
    list_display = ('id', 'name', 'org', 'balance', 'status', 'created_at', 'modified_at')
    list_filter = [
        Filter1,
        ('status', DropdownFilter),
        'created_at',
        'modified_at'
    ]
    autocomplete_fields = ['org']
    list_per_page = 25


class ResSourceAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Task ID'  # display title
        field_name = 'task'  # name of the foreign key field

    class Filter2(AutocompleteFilter):
        title = 'Source ID'  # display title
        field_name = 'source'  # name of the foreign key field

    search_fields = ['id']
    list_display = ('id', 'get_html_content', 'get_type', 'task', 'status', 'created_at', 'modified_at')
    list_filter = [
        Filter1,
        Filter2,
        ('status', DropdownFilter),
        'created_at',
        'modified_at'
    ]
    autocomplete_fields = ['task', 'source']
    list_per_page = 25

    def get_html_content(self, object):
        if object.source.s_type == 'IM':
            return mark_safe(f"<img src='{object.source.file_link.url}' width=50>")

    def get_type(self, object):
        return object.source.s_type


class FormAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Order ID'  # display title
        field_name = 'order'  # name of the foreign key field

    search_fields = ['id']
    list_display = ('id', 'is_active', 'duration', 'repeat_times', 'created_at', 'modified_at')
    list_filter = ['is_active',
                   Filter1,
                   ('duration', ChoiceDropdownFilter),
                   ('repeat_times', DropdownFilter),
                   'modified_at',
                   ]
    autocomplete_fields = ['order', ]
    list_per_page = 25


class TaskAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Executor Name'  # display title
        field_name = 'executor'  # name of the foreign key field

    class Filter2(AutocompleteFilter):
        title = 'Form ID'  # display title
        field_name = 'form'  # name of the foreign key field

    search_fields = ['id']
    list_display = ('id', 'start_DateTime', 'end_DateTime')
    list_filter = [
        Filter1,
        Filter2,
        ('status', ChoiceDropdownFilter),
        'start_DateTime',
        'end_DateTime'
    ]
    autocomplete_fields = ['form', 'executor']
    list_per_page = 25


class OrgAdmin(admin.ModelAdmin):
    search_fields = ['id']
    list_display = ('id', 'name', 'profile', 'email', 'balance', 'status', 'created_at', 'modified_at')
    list_filter = [
        ("status", ChoiceDropdownFilter),
        'created_at',
        'modified_at'
    ]
    autocomplete_fields = ['profile']
    list_per_page = 25


class AnswerAdmin(admin.ModelAdmin):
    class AnswerFilter(AutocompleteFilter):
        title = 'Reserved Source ID'  # display title
        field_name = 'res_source'  # name of the foreign key field

    class AnswerFilter2(AutocompleteFilter):
        title = 'Executor name'  # display title
        field_name = 'executor'  # name of the foreign key field

    class AnswerFilter3(AutocompleteFilter):
        title = 'Task ID'  # display title
        field_name = 'task'  # name of the foreign key field

    list_display = ('id', 'executor', 'task_id', 'modified_at')
    list_filter = [AnswerFilter2,
                   AnswerFilter,
                   AnswerFilter3,
                   'modified_at']
    autocomplete_fields = ['res_source', 'executor', 'task']
    list_per_page = 25


class SourceAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Order ID'  # display title
        field_name = 'order'  # name of the foreign key field

    class Filter2(AutocompleteFilter):
        title = 'Source File name'  # display title
        field_name = 'source_file_name'  # name of the foreign key field

    list_display = ('id', 'get_html_content', 'order', 'repeat_time_plan', 'repeat_time_fact', 's_type', 'status')
    list_display_links = ('id',)
    search_fields = ('id',)
    list_filter = [
        Filter1,
        ('source_file_name', DropdownFilter),
        ("s_type", DropdownFilter),
        ('status', DropdownFilter),
        ("repeat_time_plan", DropdownFilter),
        ("repeat_time_fact", DropdownFilter)
    ]
    # fields = ('get_html_content',)
    readonly_fields = ('get_html_content',)
    autocomplete_fields = ['order']
    list_per_page = 25

    def get_html_content(self, object):
        if object.s_type == 'IM':
            return mark_safe(f"<img src='{object.file_link.url}' width=50>")


class TransAdmin(admin.ModelAdmin):
    class Filter1(AutocompleteFilter):
        title = 'Organization ID'  # display title
        field_name = 'org'  # name of the foreign key field

    class Filter2(AutocompleteFilter):
        title = 'Task ID'  # display title
        field_name = 'task'  # name of the foreign key field

    search_fields = ['id']
    list_display = ('id', 'org', 'task', 'res_sum','status', 'created_at', 'modified_at')
    list_filter = [
        Filter1,
        Filter2,
        ('status', ChoiceDropdownFilter),
        'created_at',
        'modified_at'
    ]
    autocomplete_fields = ['task', 'org']
    list_per_page = 25


admin.site.register(Order, OrderAdmin)
admin.site.register(Organization, OrgAdmin)
admin.site.register(Form, FormAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(ReservedSource, ResSourceAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Transaction, TransAdmin)
