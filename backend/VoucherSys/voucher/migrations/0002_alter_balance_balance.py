# Generated by Django 5.0.6 on 2024-06-11 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voucher', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='balance',
            name='balance',
            field=models.DecimalField(decimal_places=2, default=10000, max_digits=100),
        ),
    ]