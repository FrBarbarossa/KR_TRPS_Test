from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import *


class ProfileAdmin(admin.ModelAdmin):
    search_fields = ['id']
    list_display = ('id', 'user', 'get_html_content', 'balance')
    list_filter = [

    ]
    readonly_fields = ('get_html_content',)

    list_per_page = 25

    def get_html_content(self, object):
        return mark_safe(f"<img src='{object.avatar.url}' width=50>")


admin.site.register(Profile, ProfileAdmin)
