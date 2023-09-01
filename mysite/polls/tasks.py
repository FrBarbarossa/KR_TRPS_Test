from __future__ import absolute_import, unicode_literals
from celery import Celery, shared_task
from celery.schedules import crontab
# from polls.models import *
# from core.models import *
from django.db.models import F


app = Celery('tasks', broker='pyamqp://guest@localhost//')


# @app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     # Calls test('hello') every 10 seconds.
#     sender.add_periodic_task(10.0, add.s(10, 15), name='add every 10')

    # # Calls test('hello') every 30 seconds.
    # # It uses the same signature of previous task, an explicit name is
    # # defined to avoid this task replacing the previous one defined.
    # sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')
    #
    # # Calls test('world') every 30 seconds
    # sender.add_periodic_task(30.0, test.s('world'), expires=10)
    #
    # # Executes every Monday morning at 7:30 a.m.
    # sender.add_periodic_task(
    #     crontab(hour=7, minute=30, day_of_week=1),
    #     test.s('Happy Mondays!'),
    # )


@app.task
def add(x, y):
    return x + y


@shared_task
def test_celery(x):
    return f"Passed thing: {x}"

@app.task
def clean_source_status():
    from .models import Organization
    # reserved_sources = Task.objects.filter(end_DateTime_idnull=True, status='ST').select_related("form").filter(F('start_DateTime') + F("form__duration"))
    organization = Organization.objects.get(id=1)
    return organization.name
