from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.db import models
from .models import User, Item
from datetime import datetime
import json

def register(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            full_name = request.POST.get('full_name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            date_of_birth = request.POST.get('date_of_birth')
            latitude = request.POST.get('latitude')
            longitude = request.POST.get('longitude')
            location = request.POST.get('location')
            
            interests = request.POST.getlist('interests')
            interests_str = ', '.join(interests)
            
            dob = datetime.strptime(date_of_birth, '%Y-%m-%d').date()
            today = datetime.today().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            
            if age < 16:
                messages.error(request, 'You must be at least 16 years old to register.')
                return render(request, 'users/account.html')
            
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists.')
                return render(request, 'users/account.html')
            
            if User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists.')
                return render(request, 'users/account.html')
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                full_name=full_name,
                date_of_birth=dob,
                location=location,
                latitude=latitude,
                longitude=longitude,
                interests=interests_str
            )
            
            auth_login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('users:home')  # Redirect to homepage after register
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            return render(request, 'users/account.html')
    
    return render(request, 'users/account.html')

def check_username(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        available = not User.objects.filter(username=username).exists()
        return JsonResponse({'available': available})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_banned:
                messages.error(request, 'Your account has been banned.')
                return render(request, 'users/login.html')
            
            auth_login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('users:home')  # Redirect to homepage after login
        else:
            messages.error(request, 'Invalid username or password.')
            return render(request, 'users/login.html')
    
    return render(request, 'users/login.html')

def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('login')

# New views for homepage
@login_required
def home(request):
    return render(request, 'browse.html')

@login_required
def api_items(request):
    items = Item.objects.filter(is_available=True)
    
    search = request.GET.get('search', '')
    category = request.GET.get('category', 'All Items')
    
    if search:
        items = items.filter(models.Q(title__icontains=search) | models.Q(description__icontains=search))
    
    if category != 'All Items':
        items = items.filter(category=category)
    
    data = [
        {
            'id': item.id,
            'title': item.title,
            'cat': item.category,
            'desc': item.description,
            'user': 'You' if item.user == request.user else item.user.username,
            'dist': '0 mi' if item.user == request.user else 'Nearby',
            'img': item.image.url if item.image else 'https://images.unsplash.com/placeholder? w=500'
        } for item in items
    ]
    
    return JsonResponse(data, safe=False)

@login_required
def delete_item(request, item_id):
    if request.method == 'POST':
        item = Item.objects.get(id=item_id, user=request.user)
        item.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=400)