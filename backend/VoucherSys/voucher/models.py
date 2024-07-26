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


from django.db import models
from django.utils import timezone


class PaymentRefrence(models.Model):
    reference = models.CharField(max_length=255, unique=True)
    matric_number = models.CharField(max_length=225)
    email = models.EmailField(max_length=225)
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.reference


class Voucher(models.Model):

    timestamp = models.DateTimeField(auto_now_add=True)
    # voucher_name = models.CharField(max_length=255)
    # start_date = models.DateField()
    # end_date = models.DateField()
    # encrypt_voucher = models.BooleanField(default=False)
    # password = models.CharField(max_length=255, blank=True)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_vouchers"
    )
    session_id = models.CharField(max_length=255)
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
    last_ref_id = models.CharField(max_length=255)
    balance = models.DecimalField(max_digits=100, decimal_places=2, default=10000000000)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)


from django.db import models
from accounts.models import CustomUser as CustomerModel


class Payment(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    student = models.ForeignKey(
        CustomerModel, on_delete=models.CASCADE, related_name="payments"
    )
    payment_sessionId = models.CharField(max_length=100, unique=True)
    voucher_used = models.BooleanField(default=False)
    bank_used = models.CharField(max_length=100)
    generated_voucher = models.CharField(max_length=100, unique=True)
    date_created = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)

    def __str__(self):

        return f"{self.student.username} - {self.amount}"


class PaymentTransaction(models.Model):
    user = models.ForeignKey(
        CustomerModel, on_delete=models.CASCADE, related_name="transactions"
    )
    id = models.BigIntegerField(primary_key=True)
    domain = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    reference = models.CharField(max_length=100, unique=True)
    receipt_number = models.CharField(max_length=255, null=True, blank=True)
    amount = models.IntegerField()
    message = models.TextField(null=True, blank=True)
    gateway_response = models.CharField(max_length=255)
    paid_at = models.DateTimeField()
    created_at = models.DateTimeField()
    channel = models.CharField(max_length=50)
    currency = models.CharField(max_length=10)
    ip_address = models.GenericIPAddressField()
    metadata = models.JSONField(blank=True, null=True)
    fees = models.IntegerField()
    authorization_code = models.CharField(max_length=255)
    card_bin = models.CharField(max_length=50)
    last4 = models.CharField(max_length=4)
    exp_month = models.CharField(max_length=2)
    exp_year = models.CharField(max_length=4)
    card_type = models.CharField(max_length=50)
    bank = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2)
    brand = models.CharField(max_length=50)
    reusable = models.BooleanField()
    signature = models.CharField(max_length=255)
    customer_id = models.BigIntegerField()
    customer_email = models.EmailField()
    customer_code = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=50, null=True, blank=True)
    transaction_date = models.DateTimeField()
    log = models.JSONField()
    verify = models.BooleanField(default=False)
    paystack = models.BooleanField(default=False)

    def __str__(self):
        return f"Transaction {self.reference} - {self.status}"


# models.py
from django.db import models
from django.utils import timezone


class VoucherToken(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    serial = models.CharField(max_length=24, unique=True)
    token = models.CharField(max_length=225, unique=True)
    serial_number = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    date_used = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.amount} - {self.serial} - {self.serial_number}"


# Voucher.objects.all().delete()
