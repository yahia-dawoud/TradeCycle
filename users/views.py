from django.shortcuts import render, redirect

from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import User
from datetime import datetime
import json
# Create your views here.


def register(request):
    if request.method == 'POST':
        try:
            # Get form data
            username = request.POST.get('username')
            full_name = request.POST.get('full_name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            date_of_birth = request.POST.get('date_of_birth')
            latitude = request.POST.get('latitude')
            longitude = request.POST.get('longitude')
            location = request.POST.get('location')
            
            # Get selected interests
            interests = request.POST.getlist('interests')
            interests_str = ', '.join(interests)
            
            # Validate age (16+)
            dob = datetime.strptime(date_of_birth, '%Y-%m-%d').date()
            today = datetime.today().date()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            
            if age < 16:
                messages.error(request, 'You must be at least 16 years old to register.')
                return render(request, 'users/account.html')
            
            # Check if username exists
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists.')
                return render(request, 'users/account.html')
            
            # Check if email exists
            if User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists.')
                return render(request, 'users/account.html')
            
            # Create user
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
            
            # Log the user in
            auth_login(request, user)
            messages.success(request, 'Account created successfully!')
            return redirect('register')  # Redirects back to form for now
            
        except Exception as e:
            messages.error(request, f'Error creating account: {str(e)}')
            return render(request, 'users/account.html')
    
    return render(request, 'users/account.html')

# API endpoint for JavaScript to check username availability
def check_username(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        available = not User.objects.filter(username=username).exists()
        return JsonResponse({'available': available})
    return JsonResponse({'error': 'Invalid request'}, status=400)


# Add this login view
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Try to authenticate
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_banned:
                messages.error(request, 'Your account has been banned.')
                return render(request, 'users/login.html')
            
            auth_login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('register')  # Change to your home page URL name later
        else:
            messages.error(request, 'Invalid username or password.')
            return render(request, 'users/login.html')
    
    return render(request, 'users/login.html')

# Add logout view
def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('login')
