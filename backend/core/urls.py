from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from app.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('get-area-codes/<int:city_code>/', Tier1OfficerAreaView.as_view(), name='tier1-officer-area-codes'),
    path('get-details/', UserDetailsView.as_view(), name='user-details'),
    path('get-consumers/<int:city_code>/<int:area_code>/', ConsumersInAreaView.as_view(), name='tier-2-get-consumers'),
    path('get-defaulters/<int:city_code>/<int:area_code>/', DefaultersInAreaView.as_view(), name='area-defaulters'),
    path('get-consumption-history-weekly/<int:consumer_number>/', ConsumptionHistoryWeeklyView.as_view(), name='consumption_history_api'),
    path('get-consumption-history-daily/<int:consumer_number>/', ConsumptionHistoryDailyView.as_view(), name='consumption_history_api'),
    path('get-consumption-history-hourly/<int:consumer_number>/', ConsumptionHistoryHourlyView.as_view(), name='consumption_history_api'),
    path('get-fraud-status/<int:consumer_number>/', CheckFraudStatus.as_view(), name='consumption_history_api'),
    path('update-fraud-status/<int:consumer_number>/', FraudStatusUpdateAPIView.as_view(), name='fraud-status-update'),
    path('submit-report/', SubmitReport.as_view(), name='submit-report'),
    path('get-tier3-officers/', Tier3OfficersUnderTier2.as_view(), name='tier3_officers'),
    path('submit-report/<int:consumer_number>/', SubmitReport.as_view(), name='submit_report_api'),
    path('assign-raid/<int:tier3_officer_id>/', AssignRaid.as_view(), name='assign_raid'),
    path('get-report/<int:consumer_number>/', RaidReportView.as_view(), name='get_report'),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
