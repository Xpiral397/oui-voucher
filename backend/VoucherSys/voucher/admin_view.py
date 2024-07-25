# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Voucher, Notification, Balance
from .serializers import (
    VoucherCreateSerializer,
    VoucherSerializer,
    NotificationSerializer,
    BalanceSerializer,
    TransactionSerializer,
    PaymentTransaction,
    PaymentTransactionSerializer,
)
from rest_framework.authtoken.models import Token
from accounts.serializers import AdminSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .utilis import *
from django.shortcuts import get_object_or_404
from accounts.models import CustomUser as User
import random


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_voucher_by_session_id(request, session_id):
    voucher = get_object_or_404(Voucher, session_id=session_id)
    serializer = VoucherSerializer(voucher)
    return Response(serializer.data)


# @permission_classes([IsAdminUser])
@csrf_exempt
@api_view(["GET"])
def get_admin_profile(request):
    try:
        if request.user:
            user = User.objects.get(email=request.user)
            print(user)

            if True:
                return Response(
                    {
                        "username": user.username,
                        "gender": user.gender,
                        "email": user.email,
                    },
                    status=status.HTTP_200_OK,
                )
        v = 6 ** "" / 3  # Error
    except Exception as e:
        return Response(
            {"detail": "An error occurred while retrieving admin profile." + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Balance  # Make sure to import your models
from .utilis import verify_payment  # Assuming verify_payment is in utils.py


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def fundUserAccount(request):
    reference = request.data.get("reference")
    try:
        exist = PaymentTransaction.objects.get(reference=reference)
        print(exist)
        return Response(
            {"detail": "Already used. "},
            status=status.HTTP_208_ALREADY_REPORTED,
        )
    except PaymentTransaction.DoesNotExist:
        print(PaymentTransaction.objects.all())
        # exist = PaymentTransaction.objects.get(reference=reference)
    # try:
    Output = verify_payment(reference, True)
    # print(Output)
    data, amount, email, model, isVerified = Output
    # except TypeError as e:
    #     return Response(
    #         {"detail": "An error occurred while funding the account. "},
    #         status=status.HTTP_400_BAD_REQUEST,
    #     )

    if isVerified:
        try:
            if isVerified:
                notification_message = (
                    f"You have successfully fund your account with {data}"
                )
                notification_serializer = NotificationSerializer(
                    data={"user": request.user.id, "message": notification_message}
                )

                if notification_serializer.is_valid():
                    pass

                user = User.objects.get(email=email)
                balance, created = Balance.objects.get_or_create(user=user)
                try:
                    exist = PaymentTransaction.objects.get(reference=reference)
                except PaymentTransaction.DoesNotExist:
                    balance.balance += int(amount / 100)
                    balance.save()
                    notification_serializer.save()
                    return Response(
                        {"detail": "Account funded successfully."},
                        status=status.HTTP_200_OK,
                    )
            return Response(
                {"detail": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": "An error occurred while funding the account. " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return Response(
            {
                "detail": "All fields (email, matric_number, amount, reference) are required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("email")
        password = request.data.get("password")

        print("Jira")
        # Try to authenticate as an admin (using email)
        user = authenticate(request, username=username, password=password)
        print(user)

        if user is not None:
            # Check if the user is admin or student
            if user.is_staff or not user.is_staff:
                # Generate a token for the authenticated user
                Token.objects.filter(user=user).delete()
                token, created = Token.objects.get_or_create(user=user)
                return Response({"token": str(token)}, status=status.HTTP_200_OK)
        # If not an admin, try to authenticate as a student (using matrix number)
        user = authenticate(request, username=username, password=password)

        if user is not None and not user.is_staff:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            )

        return Response(
            {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


print(decode_jwt_token("1892ba5301afb051f2789f5df1c818cb980a0cd5"))


@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_create_voucher(request):
    # print(request.data)

    creator = request.user
    data = request.data
    external_user_id = data.get("externalUserId")
    if True:
        try:
            external_user = User.objects.get(matric_number=external_user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "External user not found."}, status=status.HTTP_404_NOT_FOUND
            )
        created_for = external_user

    # Process fee data
    fees_data = request.data.get("fees", [])
    values = [fee["name"] for fee in fees_data]

    # Calculate total amount
    total_amount = sum(fee["amount"] for fee in fees_data)

    # Check if user's balance can afford the voucher
    user_balance = Balance.objects.get_or_create(user=external_user)
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
            return Response(serializer.data, status=status.enti)

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
def admin_send_notifications(request, id):
    user = User.objects.get(id=id)
    data = request.data
    notification_serializer = NotificationSerializer(
        data={"user": request.user.id, "message": data.message}
    )
    try:
        notifications = Notification.objects.get(user=request.user.id, id=id).delete()
        return Response({}, status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_get_all_vouchers(request):
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
def admin_get_voucher_by_id(request, id):
    try:
        voucher = Voucher.objects.get(id=id)
        serializer = VoucherSerializer(voucher)
        return Response(serializer.data)
    except Voucher.DoesNotExist:
        return Response(
            {"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND
        )
