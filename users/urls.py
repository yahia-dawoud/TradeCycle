from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('api/check-username/', views.check_username, name='check_username'),
]
