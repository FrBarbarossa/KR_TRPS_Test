# Generated by Django 4.1.2 on 2023-08-19 07:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_profile_avatar'),
        ('polls', '0016_organization_balance_organization_bio_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='bio',
            field=models.CharField(default='No bio', max_length=1000),
        ),
        migrations.AlterField(
            model_name='organization',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.profile', unique=True),
        ),
    ]
