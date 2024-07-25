# Generated by Django 5.0.6 on 2024-07-25 05:06

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0006_rename_email_number_paymentrefrence_email'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='balance',
            name='last_ref_id',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='paymenttransaction',
            name='paystack',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='paymenttransaction',
            name='verify',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_sessionId', models.CharField(max_length=100)),
                ('bank_used', models.CharField(max_length=100)),
                ('generated_voucher', models.CharField(max_length=100, unique=True)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('is_verified', models.BooleanField(default=False)),
                ('is_rejected', models.BooleanField(default=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
