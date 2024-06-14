# views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from .models import Voucher, Notification, Balance
from .serializers import (
    VoucherCreateSerializer,
    VoucherSerializer,
    NotificationSerializer,
    BalanceSerializer,
    TransactionSerializer,
)
from accounts.models import CustomUser as User

import random

# views.py

from django.shortcuts import get_object_or_404


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_voucher_by_session_id(request, session_id):
    voucher = get_object_or_404(Voucher, session_id=session_id)
    serializer = VoucherSerializer(voucher)
    return Response(serializer.data)


# Function to generate a random token
def generate_token(length=26):
    return "".join(
        random.choices(
            "OUIOUIPOUIPOIUIOIUUOOIUIOIUIOIUSSDREQA126373728393837", k=length
        )
    )


def generate_transaction_id(length=26):
    return "".join(
        random.choices("7727277223621234098762378904566789289126373728393837", k=length)
    )


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

    # Check if user's balance can afford the voucher
    user_balance = Balance.objects.get_or_create(user=creator)
    user_balance = Balance.objects.get(user=creator)
    print(user_balance.balance)
    if user_balance.balance < total_amount:
        return Response(
            {"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Generate token and session ID
    token = generate_token()
    session_id = generate_token()
    print(fees_data)

    voucher_data = {
        "voucher_name": data.get("voucherName"),
        "start_date": data.get("dateRange").get("start"),
        "end_date": data.get("dateRange").get("end"),
        "encrypt_voucher": data.get("encryptVoucher"),
        "creator": request.user.pk,
        "created_for": created_for.id if created_for else created_for,
        "semester": data.get("semester"),
        "total_amount": total_amount,
        "fees": fees_data,
        "values": values,
        "token": token,
        "creator_id": session_id,
        "session_id": session_id,
    }
    serializer = VoucherCreateSerializer(data=voucher_data)
    # serializer.create()
    if serializer.is_valid() or True:
        serializer.save()
        # if serializer.is_valid():
        # Handle balance deduction
        # balance = Balance.objects.get_or_create(user=user)
        user_balance.balance -= total_amount
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
