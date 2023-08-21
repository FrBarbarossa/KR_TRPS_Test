# Generated by Django 4.1.2 on 2023-08-17 10:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0006_alter_person_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='1', max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('balance', models.DecimalField(decimal_places=4, max_digits=19)),
                ('task_cost', models.DecimalField(decimal_places=4, max_digits=5)),
                ('status', models.CharField(choices=[('CR', 'Created'), ('PB', 'Published'), ('BD', 'Banned')], default='CR', max_length=2)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('org_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.organization')),
            ],
        ),
        migrations.CreateModel(
            name='Forms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField()),
                ('is_active', models.BooleanField(default=False)),
                ('duration', models.DurationField()),
                ('repeat_times', models.PositiveSmallIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.order')),
            ],
        ),
    ]