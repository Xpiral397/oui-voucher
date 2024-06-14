# models.py in the vouchers app

from django.db import models
from accounts.models import (
    CustomUser as User,
)  # Import User from the separate 'users' app
from django.utils import timezone


class Fee(models.Model):
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    used = models.BooleanField(default=False)  # Track if the fee is used or unused


class Voucher(models.Model):

    timestamp = models.DateTimeField(auto_now_add=True)
    voucher_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    encrypt_voucher = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_vouchers"
    )
    created_for = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_vouchers",
        null=True,
        blank=True,
    )
    semester = models.CharField(max_length=10)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    fees = fees = models.ManyToManyField(Fee)  # Many-to-many relationship with Fee
    values = models.TextField()


class Transaction(models.Model):
    transaction_id = models.CharField(max_length=255)
    session_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fees = models.ManyToManyField(
        Fee, related_name="transactions"
    )  # Many-to-many relationship with Fee
    timestamp = models.DateTimeField(auto_now_add=True)


class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=100, decimal_places=2, default=10000000000)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
