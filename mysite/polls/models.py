from django.db import models
import time
from users.models import Profile


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.order.org.profile.user.id, filename)


class Person(models.Model):
    name = models.CharField(unique=True, max_length=100, default='1')

    class Meta:
        ordering = ['name']


class Organization(models.Model):
    name = models.CharField(unique=True, max_length=100, default='1')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)


# Create your models here.
class Order(models.Model):
    CREATED = 'CR'
    PUBLISHED = 'PB'
    BANNED = 'BD'
    # LOW MONEY & Co

    STATUS_CHOICES = [
        (CREATED, 'Created'),
        (PUBLISHED, 'Published'),
        (BANNED, 'Banned'),

    ]
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=19, decimal_places=4)
    task_cost = models.DecimalField(max_digits=5, decimal_places=4)
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=CREATED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class Form(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    data = models.JSONField()
    is_active = models.BooleanField(default=False)
    duration = models.DurationField()
    repeat_times = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class Source(models.Model):
    TYPES = [
        ("IM", "Inage"),
        ("VD", "Videos"),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    file_link = models.FileField(upload_to=user_directory_path)
    s_type = models.CharField(max_length=2, choices=TYPES)
    repeat_time_plan = models.PositiveSmallIntegerField()
    repeat_time_fact = models.PositiveSmallIntegerField()


class Task(models.Model):
    STARTED = 'ST'
    DONE = 'DN'
    LOST = 'LS'

    STATUS_CHOICES = [
        (STARTED, 'Started'),
        (DONE, 'Done'),
        (LOST, 'Lost'),

    ]
    executor = models.ForeignKey(Profile, on_delete=models.CASCADE)
    form = models.ForeignKey(Form, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=STARTED
    )
    start_DateTime = models.DateTimeField(auto_now_add=True)
    end_DateTime = models.DateTimeField()


class ReservedSource(models.Model):
    RESERVED = 'RD'
    DONE = 'DN'
    LOST = 'LS'
    STATUS_CHOICES = [
        (RESERVED, 'Started'),
        (DONE, 'Done'),
        (LOST, 'Lost'),

    ]
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=RESERVED
    )


class Answer(models.Model):
    executor = models.ForeignKey(Profile, on_delete=models.CASCADE)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
