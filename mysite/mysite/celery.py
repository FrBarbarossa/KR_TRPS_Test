from __future__ import absolute_import, unicode_literals

import os
from celery import Celery
from polls.tasks import add, clean_source_status

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

app = Celery('mysite')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, add.s(10, 15), name='add every 10')
    sender.add_periodic_task(5.0, clean_source_status.s(), name='add every 5')



@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request!!: {self.request!r}')
