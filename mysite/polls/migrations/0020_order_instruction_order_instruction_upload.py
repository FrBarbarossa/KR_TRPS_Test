# Generated by Django 4.1.2 on 2023-08-21 07:53

import ckeditor.fields
import ckeditor_uploader.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0019_alter_organization_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='instruction',
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        )
    ]
