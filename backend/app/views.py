from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import AreaSerializer,CitySerializer,FraudSerializer, ConsumerSerializer
from .models import Area, City,Fraud, Consumer

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
            

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import City, Area, Fraud  # Import your models
from .serializers import FraudSerializer  # Import your FraudSerializer

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