from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, IsAdminUser
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


from django.core.mail import send_mail
from django.http import JsonResponse
from django.views import View

# from .models import Invitation
from django.urls import reverse
from django.conf import settings

from django.views import View
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse

# from .models import CustomUser, Invitatio  # Assuming Invitation model is defined
from django.utils.crypto import get_random_string

from django.http import JsonResponse
from django.views import View


class AdminListView(View):
    def get(self, request, *args, **kwargs):
        # Get all admins
        admins = CustomUser.objects.filter(is_superuser=True)

        # Create a list of admins with their referred admins
        admin_list = []
        for admin in admins:
            referred_admins = Invitation.objects.filter(invited_by=admin, is_used=True)
            admin_list.append(
                {
                    "admin_name": admin.username,
                    "email": admin.email,
                    "last_active": admin.last_login,
                    "referred_admins": [
                        {
                            "email": invitation.email,
                            "created_at": invitation.created_at,
                        }
                        for invitation in referred_admins
                    ],
                }
            )

        return JsonResponse({"admins": admin_list})


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import uuid

# from .models import CustomUser, Invitation


@api_view(["POST"])
@permission_classes([IsAdminUser])
def InviteAdminView(request):
    # user = Invitation.objects.get(email="xpiral397s@gmail.com")
    # user.delete()
    try:
        import json

        data = json.loads(request.body)
        emails = data.get("emails", [])

        if not isinstance(emails, list) or not all(
            isinstance(email, str) for email in emails
        ):
            return JsonResponse({"error": "Invalid email format"}, status=400)

        fail = []
        banned = []
        already_exists = []
        # Invitation.objects.all().delete()
        for email in emails:
            if CustomUser.objects.filter(email=email).exists():
                already_exists.append(email)
                continue  # Skip existing users

            if Invitation.objects.filter(
                email=email
            ).exists():  # Assuming banned or restricted users are flagged this way
                banned.append(email)
                continue

            # Create invitation
            token = uuid.uuid4().hex
            expiration_date = timezone.now() + timezone.timedelta(
                days=1
            )  # Set expiration to 1 day from now
            invitation = Invitation.objects.create(
                email=email,
                token=token,
                invited_by=request.user,
                expires_at=expiration_date,
            )

            # Generate invitation link
            invite_link = f"{settings.DOMAIN}/admin/auth/register/{token}"

            # Send invitation email
            invite_link = f"{settings.DOMAIN}/admin/auth/register/invite/{token}"
            print(invite_link)
            # Send invitation email
            try:
                subject = "Admin Invitation"
                message = f"You have been invited to become an admin. Click the link to register: {invite_link}"
                from_email = settings.DEFAULT_FROM_EMAIL
                recipient_list = [email]
                from django.utils.html import format_html

                # HTML content with a clickable link
                html_message = format_html(
                    """
                    <p>You have been invited to become an admin.</p>
                    <p>Click the link below to register:</p>
                    <p><a href={{invite_link}}">Register as Admin: </a></p>
                    """,
                    invite_link="http://" + invite_link,
                )

                send_mail(
                    subject,
                    message,  # Fallback to plain text
                    from_email,
                    recipient_list,
                    html_message=html_message,  # HTML content
                )
            except StopAsyncIteration as e:
                fail.append(email)
                print(f"Failed to send email to {email}: {e}")

        response_data = {
            "success": len(emails) - len(fail) - len(already_exists) - len(banned),
            "failed": fail,
            "already_exists": already_exists,
            "banned": banned,
        }

        if fail or already_exists or banned:
            return JsonResponse(
                response_data, status=200
            )  # Partial success with detailed information
        return JsonResponse({"success": "All invitations sent successfully."})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)


from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
from django.views import View
from django.http import JsonResponse
from django.contrib.auth.models import Group

# from .models import CustomUser, Invitation
from django.views import View
from django.http import JsonResponse
from django.core.mail import send_mail


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("matric_number", None)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(**extra_fields)


def one_hour_delay():
    return timezone.now() + timezone.timedelta(days=7)


class Invitation(models.Model):
    email = models.EmailField(unique=True)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField(default=one_hour_delay)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


@csrf_exempt
@api_view(["POST"])
def RegisterInviteView(request):

    req = request.data
    token = req.get("token")
    username = req.get("username")
    password = req.get("password")
    confirm_password = req.get("confirmPassword")
    print(token, username, password, (confirm_password))
    if password != confirm_password:
        return JsonResponse({"error": "Passwords do not match"}, status=400)

    try:
        invitation = Invitation.objects.get(token=token)
        if invitation.is_used:
            return JsonResponse({"error": "Invalid invitation token"}, status=400)
    except Invitation.DoesNotExist:
        return JsonResponse({"error": "Invalid invitation token"}, status=400)

    user = CustomUser.objects.create_user(
        email=invitation.email,
        username=username,
        password=password,
        is_admin=True,
        is_superuser=True,
    )

    # Add user to the admin group
    admin_group, _ = Group.objects.get_or_create(name="Admin")
    user.groups.add(admin_group)

    # Mark the invitation as used
    invitation.is_used = True

    return JsonResponse({"success": "Account created successfully."})


class BulkInviteAdminView(View):
    @action(detail=True, permission_classes=[IsAuthenticated])
    def post(self, request, *args, **kwargs):
        emails = request.POST.getlist("emails")
        if not emails:
            return JsonResponse({"error": "Emails are required"}, status=400)

        results = {"invited": [], "existing": []}

        for email in emails:
            if CustomUser.objects.filter(email=email).exists():
                results["existing"].append(email)
                continue

            token = uuid.uuid4().hex
            invitation = Invitation.objects.create(
                email=email, token=token, invited_by=request.user
            )
            invite_link = f"{settings.DOMAIN}/admin/auth/register/{token}"
            send_mail(
                "Admin Invitation",
                f"You have been invited to become an admin. Click the link to register: {invite_link}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            results["invited"].append(email)

        return JsonResponse({"results": results})


class BulkInviteAdminView(View):
    def post(self, request, *args, **kwargs):
        emails = request.POST.getlist("emails")
        if not emails:
            return JsonResponse({"error": "Emails are required"}, status=400)

        results = {"invited": [], "existing": []}

        for email in emails:
            if CustomUser.objects.filter(email=email).exists():
                results["existing"].append(email)
                continue

            token = uuid.uuid4().hex
            invitation = Invitation.objects.create(
                email=email, token=token, invited_by=request.user
            )
            invite_link = f"{settings.DOMAIN}/admin/auth/register/{token}"
            send_mail(
                "Admin Invitation",
                f"You have been invited to become an admin. Click the link to register: {invite_link}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
            results["invited"].append(email)

        return JsonResponse({"results": results})


# class RegisterInviteView(View):
#     def post(self, request, *args, **kwargs):
#         import json

#         req = json.loads({**request.POST})
#         token = req.get("token")
#         username = req.get("username")
#         password = req.get("password")
#         confirm_password = req.get("confirmPassword")
#         print(token, username, password, (confirm_password))
#         if password != confirm_password:
#             return JsonResponse({"error": "Passwords do not match"}, status=400)

#         try:
#             invitation = Invitation.objects.get(token=token)
#         except Invitation.DoesNotExist:
#             return JsonResponse(
#                 {"error": "Invalid invitation token: " + str(token)}, status=400
#             )

#         user = CustomUser.objects.create_user(
#             email=invitation.email,
#             username=username,
#             password=password,
#             is_admin=True,
#             is_superuser=True,
#         )

#         # Add user to the admin group
#         admin_group, _ = Group.objects.get_or_create(name="Admin")
#         user.groups.add(admin_group)

#         # Mark the invitation as used
#         invitation.delete()

#         return JsonResponse({"success": "Account created successfully."})
