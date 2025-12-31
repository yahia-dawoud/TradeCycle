from django.urls import path
from django.shortcuts import redirect
from . import views

app_name = 'users'

urlpatterns = [
    path('', lambda request: redirect('register'), name='users_home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/check-username/', views.check_username, name='check_username'),
    
    # Homepage routes
    path('home/', views.home, name='home'),
    path('api/items/', views.api_items, name='api_items'),
    path('api/items/<int:item_id>/delete/', views.delete_item, name='delete_item'),
]