# urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Endpoint to create a voucher
    path("create-voucher/", views.create_voucher, name="create_voucher"),
    # Endpoint to delete a voucher
    path(
        "delete-voucher/<int:session_id>/", views.delete_voucher, name="delete_voucher"
    ),
    # Endpoint to get all vouchers
    path("get-all-vouchers/", views.get_all_vouchers, name="get_all_vouchers"),
    # Endpoint to get  vouchers by id
    path("get-voucher-by-id/<int:id>/", views.get_voucher_by_id, name="get_a_vouchers"),
    # Endpoint to get notifications
    path("get-notifications/", views.get_notifications, name="get_notifications"),
    # Endpoint to delete notifications
    path("delete-notification/", views.get_notifications, name="get_notifications"),
    # Endpoint to get balance
    path("get-balance/", views.get_balance, name="get_balance"),
]
