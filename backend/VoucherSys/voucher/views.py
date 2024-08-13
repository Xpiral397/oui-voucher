# views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Voucher, Notification, Balance, Payment, VoucherToken
from .serializers import (
    VoucherCreateSerializer,
    VoucherSerializer,
    VoucherSerializers,
    NotificationSerializer,
    PaymentSerializer,
    BalanceSerializer,
    PaymentRefrence,
    TransactionSerializer,
)

from accounts.models import CustomUser as User
import random
from .admin_view import *
from .utilis import generate_token
from django.shortcuts import get_object_or_404


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_voucher_by_session_id(request, session_id):
    voucher = get_object_or_404(Voucher, session_id=session_id)
    serializer = VoucherSerializer(voucher)
    return Response(serializer.data)


def generate_transaction_id(length=26):
    return "".join(
        random.choices("7727277223621234098762378904566789289126373728393837", k=length)
    )


from rest_framework import generics
from .models import Payment
from .serializers import PaymentSerializer


class UsedVoucherPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(voucher_used=True)


from django.http import JsonResponse
from django.views import View
from django.core.mail import send_mail
from django.conf import settings

# from .models import Invitation
from django.contrib.auth import get_user_model


@csrf_exempt
@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def create_voucher(request):
    # print(request.data)

    creator = request.user
    data = request.data
    external_user_id = data.get("externalUserId")
    if data.get("isPayingForAnother"):
        try:
            external_user = User.objects.get(matric_number=external_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "External user not found."}, status=status.HTTP_404_NOT_FOUND
            )
        created_for = external_user
    else:
        created_for = None

    # Process fee data
    fees_data = request.data.get("fees", [])
    values = [fee["name"] for fee in fees_data]

    # Calculate total amount
    total_amount = sum(fee["amount"] for fee in fees_data)
    # print(total_amount, values)

    # Check if user's balance can afford the voucher
    user_balance = Balance.objects.get_or_create(user=creator)
    user_balance = Balance.objects.get(user=creator)
    reference = Payment.objects.last()
    if reference:
        reference_id = reference.payment_sessionId
        if user_balance.balance < total_amount:
            return Response(
                {"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(
            {"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Generate token and session ID
    token = generate_token()
    session_id = generate_token()
    # print(fees_data)

    voucher_data = {
        "creator": request.user.pk,
        "semester": data.get("semester"),
        "total_amount": total_amount,
        "fees": fees_data,
        "values": values,
        "session_id": reference_id,
    }
    print()
    serializer = VoucherCreateSerializer(data=voucher_data)
    # serializer.create()
    if serializer.is_valid(raise_exception=True) or True:
        serializer.save()
        # if serializer.is_valid():
        # Handle balance deduction
        # balance = Balance.objects.get_or_create(user=user)
        print(user_balance.balance)
        user_balance.balance -= total_amount
        print(user_balance.balance)
        user_balance.save()

        # Create notification
        notification_data = {
            "user": request.user.id,
            "amount": total_amount,
            "session_id": session_id,
            "fees": fees_data,
            "transaction_id": generate_transaction_id(),
        }
        print(notification_data)
        notification_message = (
            f"You have successfully created a voucher with total amount {total_amount} fo the folowing fees %s"
            % " <-------> ".join(values)
        )

        transaction_serializer = TransactionSerializer(data=notification_data)
        notification_serializer = NotificationSerializer(
            data={"user": request.user.id, "message": notification_message}
        )
        if transaction_serializer.is_valid() and notification_serializer.is_valid():
            notification_serializer.save()
            transaction_serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_voucher(request, pk):
    try:
        voucher = Voucher.objects.get(pk=pk)
    except Voucher.DoesNotExist:
        return Response(
            {"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND
        )

    voucher.delete()
    return Response(
        {"message": "Voucher deleted successfully."}, status=status.HTTP_204_NO_CONTENT
    )


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notifications(request):

    try:
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    except Notification.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def delete_notifications(request, id):

    try:
        notifications = Notification.objects.get(user=request.user.id, id=id).delete()
        return Response({}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_balance(request):
    try:
        balance = Balance.objects.get(user=request.user)
        serializer = BalanceSerializer(balance)
        return Response(serializer.data)
    except Balance.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response(serializer.data)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_vouchers(request):
    try:
        voucher = Voucher.objects.filter(creator=request.user.id)
        print(voucher)
        serializer = VoucherSerializer(voucher, many=True)
        return Response(serializer.data)
    except Voucher.DoesNotExist:
        return Response(
            {"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND
        )


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_voucher_by_id(request, id):
    try:
        voucher = Voucher.objects.get(id=id)
        serializer = VoucherSerializer(voucher)
        return Response(serializer.data)
    except Voucher.DoesNotExist:
        return Response(
            {"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND
        )


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_transaction_ref(request):
    if request.method == "POST":
        print(request.data)
        serializer = PaymentRefrenceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py


class VerifyPaymentView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
            payment.is_verified = True
            payment.is_rejected = False
            payment.save()
            return Response({"status": "Payment verified"}, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND
            )


class RejectPaymentView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
            payment.is_verified = False
            payment.is_rejected = True
            payment.save()
            return Response({"status": "Payment rejected"}, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND
            )


from rest_framework import status, generics


class PaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]


@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_payment(request):
    voucher = generate_token()
    email = request.data.pop("email")
    serializer = PaymentSerializer(data={**request.data, "generated_voucher": voucher})
    # send_token_email()
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        send_token_email(email, voucher)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def recharge(request):
    token = request.data.pop("token")
    try:
        for i in VoucherToken.objects.all().values():
            print(i.get("token"), i)
        obj = VoucherToken.objects.get(token=token)

    except VoucherToken.DoesNotExist:
        return Response(
            {"error": "Invalid voucher"}, status=status.HTTP_400_BAD_REQUEST
        )
    if obj.used:
        return Response(
            {"error": "Voucher already used"}, status=status.HTTP_409_CONFLICT
        )
    else:

        if request.user.matric_number:
            obj.used = True
            balance = Balance.objects.get(user=request.user)
            balance.balance += int(obj.amount)
            balance.save()
            request.user.save()
            send_alert_email(request.user.email, obj.amount)
            obj.save()
            return Response(
                {"status": "Voucher used successfully", "new_balance": balance.balance},
                status=status.HTTP_200_OK,
            )
    return Response("Admin cannot recharge", status=status.HTTP_400_BAD_REQUEST)


# views.py
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import Voucher
from .serializers import VoucherSerializer


class VoucherListCreate(generics.ListCreateAPIView):
    queryset = VoucherToken.objects.all()
    serializer_class = VoucherSerializers

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
