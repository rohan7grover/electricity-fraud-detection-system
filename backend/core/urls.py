from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from app.views import Tier1OfficerAreaView,UserDetailsView,DefaultersInAreaView
from app.views import ConsumersInAreaView
from app.views import DefaultersInAreaView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('get-area-codes/<int:city_code>/', Tier1OfficerAreaView.as_view(), name='tier1-officer-area-codes'),
    path('get-details/', UserDetailsView.as_view(), name='user-details'),
    path('get-consumers/<int:city_code>/<int:area_code>/', ConsumersInAreaView.as_view(), name='tier-2-get-consumers'),
    path('get-defaulters/<int:city_code>/<int:area_code>/', DefaultersInAreaView.as_view(), name='area-defaulters'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
