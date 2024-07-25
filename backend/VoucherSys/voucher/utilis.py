import requests, random
from accounts.models import CustomUser as User
from .serializers import PaymentRefrenceSerializer, PaymentTransactionSerializer
from .models import PaymentRefrence, CustomerModel


def generate_token(length=26):
    return "".join(
        random.choices(
            "23456789009876543311234123423453456456756786789789089090900", k=length
        )
    )


import requests, json


def extract_data(data):
    # print(data)
    # Map fields from JSON to serializer fields
    extracted_data = {
        "id": data.get("id"),
        "domain": data.get("domain"),
        "status": data.get("status"),
        "reference": data.get("reference"),
        "receipt_number": data.get("receipt_number"),
        "amount": data.get("amount"),
        "message": data.get("message"),
        "gateway_response": data.get("gateway_response"),
        "paid_at": data.get("paid_at"),
        "created_at": data.get("created_at"),
        "channel": data.get("channel"),
        "currency": data.get("currency"),
        "ip_address": data.get("ip_address"),
        "metadata": data.get("metadata"),
        "fees": data.get("fees"),
        "authorization_code": data.get("authorization", {}).get("authorization_code"),
        "card_bin": data.get("authorization", {}).get("bin"),
        "last4": data.get("authorization", {}).get("last4"),
        "exp_month": data.get("authorization", {}).get("exp_month"),
        "exp_year": data.get("authorization", {}).get("exp_year"),
        "card_type": data.get("authorization", {}).get("card_type"),
        "bank": data.get("authorization", {}).get("bank"),
        "country_code": data.get("authorization", {}).get("country_code"),
        "brand": data.get("authorization", {}).get("brand"),
        "reusable": data.get("authorization", {}).get("reusable"),
        "signature": data.get("authorization", {}).get("signature"),
        "customer_id": data.get("customer", {}).get("id"),
        "customer_email": data.get("customer", {}).get("email"),
        "customer_code": data.get("customer", {}).get("customer_code"),
        "customer_phone": data.get("customer", {}).get("phone"),
        "transaction_date": data.get("transaction_date"),
        "log": data.get("log"),
    }

    return extracted_data


def verify_payment(paystack_reference, _tuple=False):
    paystack_secret_key = "sk_test_910739f0f2b5a9929339eeec0a11203923f31927"
    url = f"https://api.paystack.co/transaction/verify/{paystack_reference}"

    headers = {
        "Authorization": f"Bearer {paystack_secret_key}",
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)

    # print(response)

    if response.status_code == 200:
        response_data = response.json()

        if response_data["status"] == True:

            data = response_data["data"]
            if data["status"] == "success":
                # print("Success")
                extracted_data = extract_data(data)
                print(extracted_data.get("customer_email"))
                user = CustomerModel.objects.get(
                    email=extracted_data.get("customer_email")
                )
                payment = PaymentTransactionSerializer(
                    data={"user": user.id, **extracted_data}
                )
                if payment.is_valid(raise_exception=True):
                    payment.save()
                    print("saved")
                    return (
                        (
                            payment.data,
                            extracted_data.get("amount"),
                            extracted_data.get("customer_email"),
                            payment,
                            True,
                        )
                        if _tuple
                        else (response, True)
                    )
                return None, None, False


def decode_jwt_token(token):
    try:
        import jwt

        # Decode the token using the secret key
        decoded_token = jwt.decode(
            token,
            "django-insecure-_hx06loaqv%tgk%=g(5(jj(9pby(c5y(*=94m8%3tp0m7#ut2(",
            algorithms=["HS256"],
        )
        return decoded_token
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}


def generate_transaction_id(length=26):
    return "".join(
        random.choices(
            "77272772236212340987623789045667442262526282202926243141526272821911513134780987615789982442389289126373728393837",
            k=length,
        )
    )


# utils.py
from django.core.mail import send_mail
from django.conf import settings


def send_token_email(user_email, token):
    subject = "Your Token Information"
    message = f"This message is from Oduduwa University. For the token you bought , your token is: {token}"
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user_email]
    send_mail(subject, message, email_from, recipient_list)


def send_alert_email(user_email, token):
    subject = "Account Balance Recharge"
    message = f"Your account have been recharge with: " + "NGN" + "{:,}".format(token)
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user_email]
    send_mail(subject, message, email_from, recipient_list)


def authenticate(request, username=None, password=None, **kwargs):
    try:
        print(username)
        user = User.objects.get(email=username)
        if user.check_password(password):
            return user
    except User.DoesNotExist:
        return None
