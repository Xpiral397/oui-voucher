# Generated by Django 5.0.6 on 2024-07-26 09:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0013_vouchertoken_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vouchertoken',
            name='token',
            field=models.CharField(max_length=225, unique=True),
        ),
    ]
