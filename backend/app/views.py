from django.db.models import F, Value
from django.db.models import CharField, Case, When
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncWeek, TruncDate
from django.db.models import Sum, Count, OuterRef, Subquery
from datetime import timezone
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.db import models
from .serializers import *
from .models import *
from django.db.models import Count, Q


# get all areas of a city
class Tier1OfficerAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            try:
                City.objects.get(city_code=city_code,
                                 tier1_officer=tier1_officer)
            except City.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            subquery = Fraud.objects.filter(consumer_number__area_code=OuterRef('area_code'), consumer_number__city_code=city_code, fraud_status=True).values(
                'consumer_number__area_code').annotate(defaulter_count=Count('consumer_number__area_code')).values('defaulter_count')

            areas = Area.objects.filter(city_code=city_code).annotate(
                defaulter_count=Subquery(subquery)).order_by('area_code')

            serialized_areas = CustomAreaSerializer(areas, many=True).data
            return Response({'areas': serialized_areas}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


# get all defaulters in the area or city of the logged in user
class DefaultersInAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code, area_code, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            try:
                City.objects.get(city_code=city_code,
                                 tier1_officer=tier1_officer)
            except City.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'tier2':
            tier2_officer = request.user
            try:
                Area.objects.get(
                    area_code=area_code, city_code=city_code, tier2_officer=tier2_officer)
            except Area.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        defaulters = Fraud.objects.filter(
            consumer_number__area_code=area_code,
            consumer_number__city_code=city_code,
            fraud_status=True
        ).order_by('consumer_number__consumer_number')
        serializer = FraudSerializer(defaulters, many=True)
        return Response({'defaulters': serializer.data}, status=status.HTTP_200_OK)


# get the required details for the first page of logged in user
class UserDetailsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            city = City.objects.get(tier1_officer=tier1_officer)
            serializer = CitySerializer(city)
            return Response({'details': serializer.data}, status=status.HTTP_200_OK)
        elif request.user.role == 'tier2':
            tier2_officer = request.user
            area = Area.objects.get(tier2_officer=tier2_officer)
            serializer = AreaSerializer(area)
            return Response({'details': serializer.data}, status=status.HTTP_200_OK)
        elif request.user.role == 'tier3':
            tier3_officer = request.user.id
            pending_raids = RaidStatus.objects.filter(
                tier3_officer=tier3_officer, raid_status='pending'
            )
            serializer = RaidStatusSerializer(pending_raids, many=True)
            return Response({'pending_raids': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


# get all the consumers data in the area of a particular logged in tier2 user
class ConsumersInAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code, area_code, format=None):
        if request.user.role == 'tier2':
            tier2_officer = request.user
            try:
                Area.objects.get(
                    area_code=area_code, city_code=city_code, tier2_officer=tier2_officer)
            except Area.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            consumers = Consumer.objects.filter(
                city_code=city_code, area_code=area_code).order_by('consumer_number')
            serializer = ConsumerSerializer(consumers, many=True)
            return Response({'consumers': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


# get consumption history weekly data
class ConsumptionHistoryWeeklyView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        user_tier = request.user.role
        if user_tier == 'tier1':
            try:
                user_city_code = City.objects.get(
                    tier1_officer=request.user).city_code
            except City.DoesNotExist:
                return Response({'detail': 'City information not found for the tier1 user'},
                                status=status.HTTP_403_FORBIDDEN)
        elif user_tier == 'tier2':
            try:
                user_area = Area.objects.get(tier2_officer=request.user)
                user_city_code = user_area.city_code.city_code
                user_area_code = user_area.area_code
            except Area.DoesNotExist:
                return Response({'detail': 'Area information not found for the tier2 user'},
                                status=status.HTTP_403_FORBIDDEN)

        consumption_history = ConsumptionHistory.objects.filter(
            consumer_number__consumer_number=consumer_number,
            consumer_number__city_code=user_city_code,
        )

        if user_tier == 'tier2':
            consumption_history = consumption_history.filter(
                consumer_number__area_code=user_area_code
            )

        if not consumption_history.exists():
            return Response({'detail': 'Consumer not found'}, status=status.HTTP_404_NOT_FOUND)

        aggregated_data = consumption_history.annotate(
            week=TruncWeek('time')
        ).values('week').annotate(
            total_consumption=Sum('consumption')
        ).order_by('week')

        serializer = WeeklyConsumptionHistorySerializer(
            aggregated_data, many=True)

        return Response({'consumption_history': serializer.data}, status=status.HTTP_200_OK)


# get consumption history daily data
class ConsumptionHistoryDailyView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        user_tier = request.user.role
        if user_tier == 'tier1':
            try:
                user_city_code = City.objects.get(
                    tier1_officer=request.user).city_code
            except City.DoesNotExist:
                return Response({'detail': 'City information not found for the tier1 user'},
                                status=status.HTTP_403_FORBIDDEN)
        elif user_tier == 'tier2':
            try:
                user_area = Area.objects.get(tier2_officer=request.user)
                user_city_code = user_area.city_code.city_code
                user_area_code = user_area.area_code
            except Area.DoesNotExist:
                return Response({'detail': 'Area information not found for the tier2 user'},
                                status=status.HTTP_403_FORBIDDEN)

        consumption_history = ConsumptionHistory.objects.filter(
            consumer_number__consumer_number=consumer_number,
            consumer_number__city_code=user_city_code,
        )

        if user_tier == 'tier2':
            consumption_history = consumption_history.filter(
                consumer_number__area_code=user_area_code
            )

        if not consumption_history.exists():
            return Response({'detail': 'Consumer not found'}, status=status.HTTP_404_NOT_FOUND)

        aggregated_data = consumption_history.annotate(
            date=TruncDate('time')
        ).values('date').annotate(
            total_consumption=Sum('consumption')
        ).order_by('date')

        serializer = DailyConsumptionHistorySerializer(
            aggregated_data, many=True)

        return Response({'consumption_history': serializer.data}, status=status.HTTP_200_OK)


# check if user is fraud
class CheckFraudStatus(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        user_tier = request.user.role
        if user_tier == 'tier1':
            try:
                user_city_code = City.objects.get(
                    tier1_officer=request.user).city_code
            except City.DoesNotExist:
                return Response({'detail': 'City information not found for the tier1 user'},
                                status=status.HTTP_403_FORBIDDEN)
        elif user_tier == 'tier2':
            try:
                user_area = Area.objects.get(tier2_officer=request.user)
                user_city_code = user_area.city_code.city_code
                user_area_code = user_area.area_code
            except Area.DoesNotExist:
                return Response({'detail': 'Area information not found for the tier2 user'},
                                status=status.HTTP_403_FORBIDDEN)

        fraud_status = Fraud.objects.filter(
            consumer_number__consumer_number=consumer_number,
            consumer_number__city_code=user_city_code,
        )

        if user_tier == 'tier2':
            fraud_status = fraud_status.filter(
                consumer_number__area_code=user_area_code
            )

        if not fraud_status.exists():
            return Response({'detail': 'Consumer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = FraudStatusSerializer(fraud_status.first(), many=False)

        return Response({'fraud_status': serializer.data}, status=status.HTTP_200_OK)


# get consumption history hourly data
class ConsumptionHistoryHourlyView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        user_tier = request.user.role

        date_param = request.query_params.get('date', None)

        if not date_param:
            return Response({'detail': 'Date parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Convert the date parameter to a datetime object
        try:
            target_date = timezone.datetime.strptime(
                date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response({'detail': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        if user_tier == 'tier1':
            try:
                user_city_code = City.objects.get(
                    tier1_officer=request.user).city_code
            except City.DoesNotExist:
                return Response({'detail': 'City information not found for the tier1 user'},
                                status=status.HTTP_403_FORBIDDEN)
        elif user_tier == 'tier2':
            try:
                user_area = Area.objects.get(tier2_officer=request.user)
                user_city_code = user_area.city_code.city_code
                user_area_code = user_area.area_code
            except Area.DoesNotExist:
                return Response({'detail': 'Area information not found for the tier2 user'},
                                status=status.HTTP_403_FORBIDDEN)

        consumption_history = ConsumptionHistory.objects.filter(
            consumer_number__consumer_number=consumer_number,
            consumer_number__city_code=user_city_code,
            time__date=target_date,
        )

        if user_tier == 'tier2':
            consumption_history = consumption_history.filter(
                consumer_number__area_code=user_area_code
            )

        if not consumption_history.exists():
            return Response({'detail': 'Consumer not found for the given date'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ConsumptionHistorySerializer(
            consumption_history, many=True)

        return Response({'consumption_history': serializer.data}, status=status.HTTP_200_OK)


# update fraud status
class FraudStatusUpdateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser]

    def patch(self, request, consumer_number, *args, **kwargs):
        if request.user.role not in ['tier1', 'tier2']:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        fraud_instance = Fraud.objects.get(consumer_number=consumer_number)
        serializer = FraudStatusSerializer(
            fraud_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# get tier3 officer details for a tier2 user
class Tier3OfficersUnderTier2(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.role == 'tier2':
            tier2_officer = request.user
            try:
                tier3_officers = Tier2Tier3Relationship.objects.filter(
                    tier2_officer__tier2_officer=tier2_officer)
            except Tier2Tier3Relationship.DoesNotExist:
                return Response({'detail': 'No Tier 3 officers found under the Tier 2 officer'},
                                status=status.HTTP_404_NOT_FOUND)

            result = []
            for relationship in tier3_officers:
                tier3_officer = relationship.tier3_officer
                pending_raids_count = RaidStatus.objects.filter(
                    tier3_officer=tier3_officer.id,
                    raid_status='pending'
                ).count()

                # Create the result dictionary for the current tier3 officer
                tier3_officer_data = {
                    "id": tier3_officer.id,
                    "email": tier3_officer.email,
                    "name": tier3_officer.name,
                    "pending_raids_count": pending_raids_count
                }

                result.append(tier3_officer_data)

            return Response({'tier3_officers': result}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


# Assign raid to a tier3 officer
class AssignRaid(APIView):
    def post(self, request, tier3_officer_id, format=None):
        consumer_number_value = request.data.get('consumer_number', None)
        tier2_officer = request.user.id

        if not (consumer_number_value and tier2_officer and tier3_officer_id):
            return Response({'detail': 'Missing required data in the request'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            relationship = Tier2Tier3Relationship.objects.get(
                tier3_officer=tier3_officer_id)
        except Tier2Tier3Relationship.DoesNotExist:
            return Response({'detail': 'No Tier 3 officer found for the Tier 2 officer'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            consumer = Consumer.objects.get(
                consumer_number=consumer_number_value, area_code=relationship.tier2_officer.area_code)
        except Consumer.DoesNotExist:
            return Response({'detail': 'Consumer not found in the specified area'},
                            status=status.HTTP_403_FORBIDDEN)

        raid_data = {
            'tier3_officer': tier3_officer_id,
            'consumer_number': consumer_number_value,
            'raid_status': 'pending',
        }
        serializer = RaidStatusSerializer(data=raid_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# submit raid report of a consumer
class SubmitReport(APIView):
    def patch(self, request, consumer_number, format=None):
        tier3_officer_id = request.user.id
        is_defaulter_value = request.data.get('is_defaulter', None)
        image_id_value = request.data.get('image_id', None)
        comment_value = request.data.get('comment', None)

        if not (is_defaulter_value):
            return Response({'detail': 'Missing required data in the request'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            pending_raid = RaidStatus.objects.get(
                consumer_number=consumer_number,
                tier3_officer=tier3_officer_id,
                raid_status='pending'
            )
        except RaidStatus.DoesNotExist:
            return Response({'detail': 'No pending raid found for the specified consumer and tier3 officer'},
                            status=status.HTTP_404_NOT_FOUND)

        pending_raid.raid_status = 'completed'
        pending_raid.is_defaulter = is_defaulter_value
        pending_raid.image_id = image_id_value
        pending_raid.comment = comment_value
        pending_raid.raid_date = timezone.now()
        pending_raid.save()

        serializer = RaidStatusSerializer(pending_raid)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RaidReportView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        if request.user.role == 'tier1' or request.user.role == 'tier2':
            raid_rows = RaidStatus.objects.filter(consumer_number=consumer_number).order_by(
                Case(
                    When(raid_status='pending', then=Value(1)),
                    default=Value(2),
                ),
                '-raid_date'
            )

            serializer = RaidStatusSerializer(raid_rows, many=True)
            return Response({'report': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
