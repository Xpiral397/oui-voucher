# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("create-voucher/", views.create_voucher, name="create_voucher"),
    path(
        "delete-voucher/<int:session_id>/", views.delete_voucher, name="delete_voucher"
    ),
    path("get-all-vouchers/", views.get_all_vouchers, name="get_all_vouchers"),
    path("get-voucher-by-id/<int:id>/", views.get_voucher_by_id, name="get_a_vouchers"),
    path("get-notifications/", views.get_notifications, name="get_notifications"),
    path("delete-notification/", views.get_notifications, name="get_notifications"),
    path("get-balance/", views.get_balance, name="get_balance"),
    #  ADMIN ENDPOIN
    path("admin/login/", views.LoginView.as_view(), name="login"),
    path("fundaccount/", views.fundUserAccount, name="fund-account"),
    path("admin/me/", views.get_admin_profile, name="login-view"),
    path("admin/create-voucher/", views.admin_create_voucher, name="create_voucher"),
    path(
        "admin/get-all-vouchers/", views.admin_get_all_vouchers, name="get_all_vouchers"
    ),
    path(
        "verify/<int:payment_id>/",
        views.VerifyPaymentView.as_view(),
        name="verify_payment",
    ),
    path(
        "reject/<int:payment_id>/",
        views.RejectPaymentView.as_view(),
        name="reject_payment",
    ),
    path("payments/", views.PaymentListView.as_view(), name="payment_list"),
    path("recharge/", views.recharge, name="recharge"),
    path("create-payments/", views.create_payment, name="payment_list"),
    path("ref/", views.create_transaction_ref, name="create_transaction"),
    path(
        "admin/get-voucher-by-id/<int:id>/",
        views.admin_get_voucher_by_id,
        name="get_a_vouchers",
    ),
    path(
        "admin/send_notifications/",
        views.admin_send_notifications,
        name="get_notifications",
    ),
    path("vouchers/", views.VoucherListCreate.as_view(), name="voucher-list-create"),
]
