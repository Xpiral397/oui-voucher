from accounts.serializers import UserSerializer
from rest_framework import serializers
from .models import Voucher, Transaction, Balance, Fee, Notification


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
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
