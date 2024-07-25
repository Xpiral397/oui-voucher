from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from accounts.models import CustomUser as User

from accounts.models import CustomUser


class ApproveAdminView(generics.GenericAPIView):
    def post(self, request, uid):
        if request.user.email != "xpiral397@gmail.com":
            return Response(
                {"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN
            )
        try:
            user = CustomUser.objects.get(pk=uid)
            if user.is_admin:
                user.is_active = True
                user.save()
                return Response(
                    {"message": "Admin approved successfully!"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "User is not an admin"}, status=status.HTTP_400_BAD_REQUEST
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST
            )


class ConfirmEmailView(generics.GenericAPIView):
    def get(self, request, uid):
        try:
            user = CustomUser.objects.get(pk=uid)
            user.is_active = True
            user.save()
            return Response(
                {"message": "Email confirmed successfully!"}, status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Invalid user ID"}, status=status.HTTP_400_BAD_REQUEST
            )


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_user_by_matric_number(request):
    try:
        user = User.objects.get(matric_number=request.data.get("matric_number"))
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {"error": "Voucher not found."}, status=status.HTTP_404_NOT_FOUND
        )
