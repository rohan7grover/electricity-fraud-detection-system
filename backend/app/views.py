from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncDate,TruncWeek
from django.db.models import Sum
from rest_framework import status
from .serializers import AreaSerializer,CitySerializer,FraudSerializer, ConsumerSerializer, CustomConsumptionHistorySerializer
from .models import Area, City,Fraud, Consumer, Area, ConsumptionHistory

class Tier1OfficerAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            areas = Area.objects.filter(city_code=city_code)
            serializer = AreaSerializer(areas, many=True)
            return Response({'areas': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

class DefaultersInAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code, area_code, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            try:
                city = City.objects.get(city_code=city_code, tier1_officer=tier1_officer)
            except City.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.role == 'tier2':   
            tier2_officer = request.user
            try:
                area = Area.objects.get(area_code=area_code, city_code=city_code, tier2_officer=tier2_officer)
            except Area.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        defaulters = Fraud.objects.filter(
            consumer_number__area_code=area_code,
            consumer_number__city_code=city_code,
            fraud_status=True
        )
        serializer = FraudSerializer(defaulters, many=True)
        return Response({'defaulters': serializer.data}, status=status.HTTP_200_OK)



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
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        defaulters = Fraud.objects.filter(
            consumer_number__area_code=area_code,
            consumer_number__city_code=city_code,
            fraud_status=True
        )
        serializer = FraudSerializer(defaulters, many=True)
        return Response({'defaulters': serializer.data}, status=status.HTTP_200_OK)



class ConsumersInAreaView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, city_code, area_code, format=None):
        if request.user.role == 'tier2':
            tier2_officer = request.user
            try:
                area = Area.objects.get(area_code=area_code, city_code=city_code, tier2_officer=tier2_officer)
            except Area.DoesNotExist:
                return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            consumers = Consumer.objects.filter(city_code=city_code, area_code=area_code)
            serializer = ConsumerSerializer(consumers, many=True)
            return Response({'consumers': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.db.models.functions import TruncWeek
from .models import ConsumptionHistory, City, Area
from .serializers import CustomConsumptionHistorySerializer

class ConsumptionHistoryView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, consumer_number, format=None):
        user_tier = request.user.role
        if user_tier == 'tier1':
            try:
                user_city_code = City.objects.get(tier1_officer=request.user).city_code
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

        serializer = CustomConsumptionHistorySerializer(aggregated_data, many=True)

        return Response({'consumption_history': serializer.data}, status=status.HTTP_200_OK)

