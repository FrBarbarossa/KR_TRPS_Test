# Generated by Django 4.1.2 on 2023-08-23 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0025_alter_order_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='description',
            field=models.CharField(default='Описание задания на разметку', max_length=150),
        ),
    ]
