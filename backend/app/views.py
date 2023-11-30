from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import AreaSerializer
from .models import Area, City

class Tier1OfficerAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            city = City.objects.get(tier1_officer=tier1_officer)
            areas = Area.objects.filter(city_code=city.city_code)
            serializer = AreaSerializer(areas, many=True)
            return Response({'areas': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


class DefaultersInAreaAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, city_code,area_code, format=None):
        if request.user.role == 'tier1':
            tier1_officer = request.user
            city = City.objects.get(tier1_officer=tier1_officer)
            defaulters=Fraud.objects.filter(
                consumer_number__area_code=area_code,
                consumer_number__city_code=city,
                fraud_status=True
            )
            serializer = FraudSerializer(defaulters, many=True)
            return Response({'defaulters': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)


class Tier2OfficerAreaView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        if request.user.role == 'tier2':
            tier2_officer = request.user
            area = Area.objects.get(tier2_officer=tier2_officer)
            serializer = AreaSerializer(area)
            return Response({'area': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)