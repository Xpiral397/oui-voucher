# Generated by Django 5.0.6 on 2024-07-25 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0007_balance_last_ref_id_paymenttransaction_paystack_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='payment_sessionId',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
