# Generated by Django 4.1.2 on 2023-08-17 11:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_profile_avatar'),
        ('polls', '0010_rename_forms_form_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('ST', 'Started'), ('DN', 'Done'), ('LS', 'Lost')], default='ST', max_length=2),
        ),
        migrations.CreateModel(
            name='ReservedSource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('RD', 'Started'), ('DN', 'Done'), ('LS', 'Lost')], default='RD', max_length=2)),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.source')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.task')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('executor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.profile')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.source')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='polls.task')),
            ],
        ),
    ]
