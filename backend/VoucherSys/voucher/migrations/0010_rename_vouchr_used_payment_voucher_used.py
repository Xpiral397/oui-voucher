# Generated by Django 5.0.6 on 2024-07-25 06:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0009_payment_vouchr_used'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payment',
            old_name='vouchr_used',
            new_name='voucher_used',
        ),
    ]
