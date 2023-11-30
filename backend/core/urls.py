from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from app.views import Tier1OfficerAreaView

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('get-area-codes/', Tier1OfficerAreaView.as_view(), name='tier1-officer-area-codes'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
