from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, role, password = None):
        if not email:
            raise ValueError('User must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email = email, name = name, role = role)

        user.set_password(password)
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(choices = [
        ('tier1', 'Tier 1'),
        ('tier2', 'Tier 2'),
        ('tier3', 'Tier 3'),
    ])
    is_active = models.BooleanField(default=True)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role']

    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return self.email