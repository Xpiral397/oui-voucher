from rest_framework import serializers
from djoser.serializers import (
    UserCreateSerializer as BaseUserCreateSerializer,
    UserSerializer as BaseUserSerializer,
)
from .models import CustomUser


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = CustomUser
        fields = (
            "id",
            "email",
            "username",
            "password",
            "surname",
            "other_name",
            "matric_number",
            "gender",
            "graduation",
            "level",
            "telephone",
            "faculty",
            "department",
            "is_student",
            "is_admin",
        )


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = CustomUser
        fields = (
            "id",
            "email",
            "username",
            "surname",
            "other_name",
            "matric_number",
            "gender",
            "graduation",
            "level",
            "telephone",
            "faculty",
            "department",
            "is_student",
            "is_admin",
        )


class AdminSerializer(serializers.Serializer):
    class Meta:
        model = CustomUser
        fields = "__all__"
