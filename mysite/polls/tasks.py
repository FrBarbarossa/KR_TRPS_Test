from __future__ import absolute_import, unicode_literals

import datetime

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


@app.task
def complete_task_timeout(task_id, person_id):
    from .models import Task, Person, ReservedSource, Source, Order, Transaction
    from users.models import Profile
    task = Task.objects.get(id=task_id)
    transaction = Transaction.objects.get(task_id=task_id)

    if task.status != "DN":
        cost = transaction.res_sum
        task.end_DateTime = datetime.datetime.now(datetime.timezone.utc)
        if task.form.repeat_times == len(task.answer_set.all()):
            profile = Profile.objects.get(id=person_id)
            transaction.status = 'DN'
            transaction.save()
            profile.balance += cost
            profile.save()
            task.status = 'DN'
        else:
            order = task.form.order
            transaction.status = 'CN'
            transaction.save()
            order.balance += cost
            order.save()
            task.status = 'LS'
            reserved_sources = ReservedSource.objects.filter(task_id=task_id, status='RD')
            reserved_sources.update(status='LS')
            source_ids = list(map(lambda x: tuple(x.values())[0], reserved_sources.values('source_id')))
            Source.objects.filter(id__in=source_ids).update(repeat_time_fact=F('repeat_time_fact') - 1)
        task.save()
    return task