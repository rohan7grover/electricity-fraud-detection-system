from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, role, password=None):
        if not email:
            raise ValueError('User must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, role=role)

        user.set_password(password)
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=7, choices=[
        ('tier1', 'Tier 1'),
        ('tier2', 'Tier 2'),
        ('tier3', 'Tier 3'),
        ('admin', 'Admin'),
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


class Area(models.Model):
    area_code = models.IntegerField()
    city_code = models.ForeignKey(
        'City', models.DO_NOTHING, db_column='city_code')
    area_name = models.CharField(max_length=255)
    tier2_officer = models.OneToOneField(
        UserAccount, models.DO_NOTHING, db_column='tier2_officer', primary_key=True)

    class Meta:
        managed = False
        db_table = 'area'
        unique_together = (('area_code', 'city_code'),)


class City(models.Model):
    city_code = models.IntegerField(primary_key=True)
    city_name = models.CharField(unique=True, max_length=255)
    tier1_officer = models.OneToOneField(
        UserAccount, models.DO_NOTHING, db_column='tier1_officer')

    class Meta:
        managed = False
        db_table = 'city'


class Consumer(models.Model):
    consumer_number = models.IntegerField(primary_key=True)
    area_code = models.ForeignKey(
        Area, models.DO_NOTHING, db_column='area_code', blank=True, null=True)
    city_code = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'consumer'


class ConsumptionHistory(models.Model):
    consumer_number = models.OneToOneField(
        Consumer, models.DO_NOTHING, db_column='consumer_number', primary_key=True)
    time = models.DateTimeField()
    consumption = models.FloatField()

    class Meta:
        managed = False
        db_table = 'consumption_history'
        unique_together = (('consumer_number', 'time'),)


class Fraud(models.Model):
    consumer_number = models.OneToOneField(
        Consumer, models.DO_NOTHING, db_column='consumer_number', primary_key=True)
    fraud_status = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fraud'


class Tier2Tier3Relationship(models.Model):
    tier3_officer = models.OneToOneField(
        UserAccount, models.DO_NOTHING, db_column='tier3_officer', primary_key=True)
    tier2_officer = models.ForeignKey(
        Area, models.DO_NOTHING, db_column='tier2_officer', to_field='tier2_officer')

    class Meta:
        managed = False
        db_table = 'tier2_tier3_relationship'


class RaidStatus(models.Model):
    tier3_officer = models.ForeignKey(
        'Tier2Tier3Relationship', models.DO_NOTHING, db_column='tier3_officer')
    consumer_number = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    raid_status = models.CharField(max_length=10, blank=True, null=True)
    is_defaulter = models.CharField(max_length=3, blank=True, null=True)
    image_id = models.CharField(max_length=255, blank=True, null=True)
    raid_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'raid_status'

