from django.db import models
import time
from users.models import Profile
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
from django.db.models import signals, F


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return "user_{0}/{1}".format(instance.order.org.profile.user.id, filename)


class Person(models.Model):
    name = models.CharField(unique=True, max_length=100, default='1')

    class Meta:
        ordering = ['name']


class Organization(models.Model):
    CREATED = 'CR'
    CONFIRMED = 'CD'
    BANNED = 'BD'
    # LOW MONEY & Co

    STATUS_CHOICES = [
        (CREATED, 'Created'),
        (CONFIRMED, 'CD'),
        (BANNED, 'Banned'),

    ]
    name = models.CharField(unique=True, max_length=100, default='1')
    profile = models.ForeignKey(Profile, unique=True, on_delete=models.CASCADE)
    bio = models.CharField(max_length=1000, default='No bio')
    balance = models.DecimalField(max_digits=19, decimal_places=4)
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=CREATED
    )
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.name)
    # default timezone.now


# Create your models here.
class Order(models.Model):
    CREATED = 'CR'
    PUBLISHED = 'PB'
    BANNED = 'BD'
    LOW_MONEY = "LM"
    NO_DATA = "ND"
    # LOW MONEY & Co

    STATUS_CHOICES = [
        (CREATED, 'Created'),
        (PUBLISHED, 'Published'),
        (BANNED, 'Banned'),
        (LOW_MONEY, "Low balance"),
        (NO_DATA, "No data for arrange")

    ]
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=19, decimal_places=4)
    task_cost = models.DecimalField(max_digits=5, decimal_places=4)
    name = models.CharField(max_length=50, default="Задание на разметку")
    description = models.CharField(max_length=150, default="Описание задания на разметку")
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=CREATED
    )
    instruction = RichTextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Form(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    data = models.JSONField(null=True)
    is_active = models.BooleanField(default=False)
    duration = models.DurationField()
    repeat_times = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Source(models.Model):
    TYPES = [
        ("IM", "Image"),
        ("VD", "Videos"),
    ]
    STATUS = [
        ("OG", "On going"),
        ("ST", "Stopped")
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    source_file_name = models.CharField(max_length=200)
    file_link = models.FileField(upload_to=user_directory_path)
    s_type = models.CharField(max_length=2, choices=TYPES)
    status = models.CharField(
        max_length=2,
        choices=STATUS,
        default='OG'
    )
    repeat_time_plan = models.PositiveSmallIntegerField()
    repeat_time_fact = models.PositiveSmallIntegerField()

    def __str__(self):
        return str(self.id)


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
    end_DateTime = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return str(self.id)


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
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Answer(models.Model):
    executor = models.ForeignKey(Profile, on_delete=models.CASCADE)
    res_source = models.ForeignKey(ReservedSource, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class Transaction(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.SET(1))
    task = models.ForeignKey(Task, unique=True, on_delete=models.CASCADE)
    res_sum = models.DecimalField(max_digits=5, decimal_places=4)
    RESERVED = 'RS'
    DONE = 'DN'
    CANCELED = 'CN'
    STRANGE = "ST"
    STATUS = [
        (RESERVED, "Reserved"),
        (CANCELED, "Canceled"),
        (DONE, "Done"),
        (STRANGE, "ST")
    ]
    status = models.CharField(
        max_length=2,
        choices=STATUS,
        default=RESERVED
    ),
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


def manage_order_status(sender, instance, created, **kwargs):
    signals.post_save.disconnect(receiver=manage_order_status, sender=Order)
    print("Save is called")
    form = Form.objects.filter(order_id=instance.id, is_active=True)
    sources = Source.objects.filter(order_id=instance.id, status='OG', repeat_time_plan__gt=F('repeat_time_fact'))
    if instance.status not in ['CR', 'BD']:
        if form:
            print(instance.balance, instance.task_cost)
            if instance.balance < instance.task_cost:
                instance.status = 'LM'
                print('LM!')
            elif len(sources) < form[0].repeat_times:
                instance.status = 'ND'
            else:
                instance.status = 'PB'
        elif len(sources) == 0:
            instance.status = 'ND'
            print("ND!")
        elif not form:
            instance.status = 'CR'
        else:
            instance.status = "PB"
            print("PB!")
    instance.save()
    signals.post_save.connect(receiver=manage_order_status, sender=Order)


signals.post_save.connect(receiver=manage_order_status, sender=Order)
