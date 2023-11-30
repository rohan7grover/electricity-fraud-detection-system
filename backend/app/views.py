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
