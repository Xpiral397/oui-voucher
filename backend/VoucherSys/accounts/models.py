from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    surname = models.CharField(max_length=150)
    other_name = models.CharField(max_length=150)
    matric_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    graduation = models.CharField(max_length=10)
    level = models.CharField(max_length=10)
    telephone = models.CharField(max_length=15)
    faculty = models.CharField(max_length=150)
    department = models.CharField(max_length=150)
    is_student = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set', blank=True)

    USERNAME_FIELD = 'matric_number'
    REQUIRED_FIELDS = ['username', 'surname', 'other_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
