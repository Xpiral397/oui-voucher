from accounts.serializers import UserSerializer
from rest_framework import serializers
from .models import Voucher, Transaction, Balance, Fee, Notification, PaymentRefrence
from rest_framework import serializers
from .models import PaymentTransaction
from accounts.models import CustomUser


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = "__all__"


class PaymentRefrenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRefrence
        fields = "__all__"


class VoucherSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    created_for = UserSerializer(read_only=True)
    fees = FeeSerializer(many=True, read_only=True)

    class Meta:
        model = Voucher
        fields = "__all__"


# Voucher.objects.all().delete()
class VoucherCreateSerializer(serializers.ModelSerializer):
    # creator = UserSerializer(read_only=True)
    # created_for = UserSerializer(read_only=True)
    fees = FeeSerializer(many=True)
    values = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Voucher
        fields = "__all__"

    def create(self, validated_data):
        fees_data = validated_data.pop("fees", [])
        voucher = Voucher.objects.create(**validated_data)
        for fee_data in fees_data:
            fee, created = Fee.objects.get_or_create(**fee_data)
            voucher.fees.add(fee)

        return voucher


class NotificationSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    fees = FeeSerializer(many=True, read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    fees = FeeSerializer(many=True, read_only=True)

    class Meta:
        model = Transaction
        fields = "__all__"


class BalanceSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)

    class Meta:
        model = Balance
        fields = "__all__"


class PaymentTransactionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = PaymentTransaction
        fields = [
            "user",
            "id",
            "domain",
            "status",
            "reference",
            "receipt_number",
            "amount",
            "message",
            "gateway_response",
            "paid_at",
            "created_at",
            "channel",
            "currency",
            "ip_address",
            "metadata",
            "fees",
            "authorization_code",
            "card_bin",
            "last4",
            "exp_month",
            "exp_year",
            "card_type",
            "bank",
            "country_code",
            "brand",
            "reusable",
            "signature",
            "customer_id",
            "customer_email",
            "customer_code",
            "customer_phone",
            "transaction_date",
            "log",
            "verify",
            "paystacks",
        ]


# serializers.py
from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"
