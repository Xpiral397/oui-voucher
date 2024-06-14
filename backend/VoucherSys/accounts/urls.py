from django.urls import path
from .views import ConfirmEmailView, ApproveAdminView, get_user_by_matric_number

urlpatterns = [
    path("get/user/", get_user_by_matric_number, name="get-user-by-id"),
    path("confirm-email/<int:uid>/", ConfirmEmailView.as_view(), name="confirm-email"),
    path("approve-admin/<int:uid>/", ApproveAdminView.as_view(), name="approve-admin"),
]
