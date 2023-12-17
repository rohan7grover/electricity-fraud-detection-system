from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserAccount, Area, City, Consumer, ConsumptionHistory, Fraud, Tier2Tier3Relationship, RaidStatus

User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'role', 'password')


class AreaSerializer(serializers.ModelSerializer):
    tier2_officer = UserCreateSerializer()

    class Meta:
        model = Area
        fields = ['area_code', 'city_code', 'area_name', 'tier2_officer']


class CitySerializer(serializers.ModelSerializer):
    tier1_officer = UserCreateSerializer()

    class Meta:
        model = City
        fields = ['city_code', 'city_name', 'tier1_officer']


class ConsumerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumer
        fields = ['consumer_number', 'area_code', 'city_code']


class ConsumptionHistorySerializer(serializers.ModelSerializer):
    consumer_number = ConsumerSerializer()

    class Meta:
        model = ConsumptionHistory
        fields = ['consumer_number', 'time', 'consumption']


class FraudSerializer(serializers.ModelSerializer):
    consumer_number = ConsumerSerializer()

    class Meta:
        model = Fraud
        fields = ['consumer_number', 'fraud_status']


class Tier2Tier3RelationshipSerializer(serializers.ModelSerializer):
    tier3_officer = UserCreateSerializer()
    tier2_officer = AreaSerializer()

    class Meta:
        model = Tier2Tier3Relationship
        fields = ['tier3_officer', 'tier2_officer']


class DateOnlyField(serializers.DateField):
    def to_representation(self, value):
        return value.date()


class CustomConsumptionHistorySerializer(serializers.Serializer):
    week = DateOnlyField()
    total_consumption = serializers.DecimalField(
        max_digits=10, decimal_places=2)


class RaidStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaidStatus
        fields = ['tier3_officer', 'consumer_number', 'comment',
                  'raid_status', 'is_defaulter', 'image_id', 'raid_date']
