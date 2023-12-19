from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserAccount, Area, City, Consumer, ConsumptionHistory, Fraud, Tier2Tier3Relationship, RaidStatus

User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'role', 'password')


class CustomAreaSerializer(serializers.ModelSerializer):
    tier2_officer = UserCreateSerializer()
    defaulter_count = serializers.SerializerMethodField()

    class Meta:
        model = Area
        fields = ['area_code', 'city_code', 'area_name',
                  'tier2_officer', 'defaulter_count']

    def get_defaulter_count(self, obj):
        return obj.defaulter_count


class CitySerializer(serializers.ModelSerializer):
    tier1_officer = UserCreateSerializer()

    class Meta:
        model = City
        fields = ['city_code', 'city_name', 'tier1_officer']


class AreaSerializer(serializers.ModelSerializer):
    tier2_officer = UserCreateSerializer()
    city_code = CitySerializer()

    class Meta:
        model = Area
        fields = ['area_code', 'city_code', 'area_name', 'tier2_officer']


class ConsumerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumer
        fields = ['consumer_number', 'area_code', 'city_code']


class CustomTimeField(serializers.Field):
    def to_representation(self, value):
        return value.strftime('%H:%M')


class ConsumptionHistorySerializer(serializers.ModelSerializer):
    time = CustomTimeField()

    class Meta:
        model = ConsumptionHistory
        fields = ['time', 'consumption']


class FraudStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fraud
        exclude = ['consumer_number']


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


class DailyConsumptionHistorySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_consumption = serializers.DecimalField(
        max_digits=10, decimal_places=2)


class WeeklyConsumptionHistorySerializer(serializers.Serializer):
    week = DateOnlyField()
    total_consumption = serializers.DecimalField(
        max_digits=10, decimal_places=2)


class RaidStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaidStatus
        fields = ['tier3_officer', 'consumer_number', 'comment',
                  'raid_status', 'is_defaulter', 'image_id', 'raid_date']
