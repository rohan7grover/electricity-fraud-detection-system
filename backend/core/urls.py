from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from app.views import Tier1OfficerAreaView
from app.views import Tier2OfficerAreaView
from app.views import ConsumersInAreaView
from app.views import DefaultersInAreaAPIView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('get-area-codes/', Tier1OfficerAreaView.as_view(), name='tier1-officer-area-codes'),
    path('get-area-code/', Tier2OfficerAreaView.as_view(), name='tier2-officer-area-code'),
    path('defaulters/<int:city_code>/<int:area_code>/', DefaultersInAreaAPIView.as_view(), name='area-defaulters'),
    path('get-consumers/<int:city_code>/<int:area_code>/', ConsumersInAreaView.as_view(), name='consumers-in-area'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
