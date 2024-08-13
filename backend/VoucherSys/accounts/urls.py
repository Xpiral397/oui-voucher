from django.urls import path
from .views import *


urlpatterns = [
    path("get/user/", get_user_by_matric_number, name="get-user-by-id"),
    path("invite-admin/", InviteAdminView, name="invite_admin"),
    path("bulk-invite-admin/", BulkInviteAdminView.as_view(), name="bulk_invite_admin"),
    path("register/", RegisterInviteView, name="register_invite"),
    path("admins/", AdminListView.as_view(), name="admin_list"),
    path("confirm-email/<int:uid>/", ConfirmEmailView.as_view(), name="confirm-email"),
    path("approve-admin/<int:uid>/", ApproveAdminView.as_view(), name="approve-admin"),
]
