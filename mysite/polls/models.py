from django.db import models


class Person(models.Model):
    name = models.CharField(unique=True, max_length=100, default='1')
    class Meta:
        ordering = ['name']
# Create your models here.
