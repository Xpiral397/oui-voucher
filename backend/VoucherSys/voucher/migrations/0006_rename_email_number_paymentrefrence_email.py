# Generated by Django 5.0.6 on 2024-07-23 09:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0005_paymentrefrence_paymenttransaction'),
    ]

    operations = [
        migrations.RenameField(
            model_name='paymentrefrence',
            old_name='email_number',
            new_name='email',
        ),
    ]
