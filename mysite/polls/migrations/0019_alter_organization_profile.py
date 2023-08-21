# Generated by Django 4.1.2 on 2023-08-21 06:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_profile_avatar'),
        ('polls', '0018_alter_organization_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.profile', unique=True),
        ),
    ]
