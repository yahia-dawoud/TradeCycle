from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    
    # Location
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    #age thing
    date_of_birth = models.DateField(null=True, blank=True)
    

    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)]
    )
    total_ratings = models.IntegerField(default=0)
    
    # Banned after 3 reports thing
    report_count = models.IntegerField(default=0)
    is_banned = models.BooleanField(default=False)
    
    # basic idea for user preferences 
    interests = models.TextField(blank=True, help_text="What items user is looking for")
    
    # automated time 7aga keda
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username
    
    def calculate_age(self):
        """Calculate user's age"""
        if not self.date_of_birth:
            return None
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    
    def update_rating(self, new_rating):
        """Update user rating after a trade"""
        total_score = (self.rating * self.total_ratings) + new_rating
        self.total_ratings += 1
        self.rating = total_score / self.total_ratings
        self.save()
    
    def add_report(self):
        """Add a report and ban if reaches 3"""
        self.report_count += 1
        if self.report_count >= 3:
            self.is_banned = True
        self.save()
