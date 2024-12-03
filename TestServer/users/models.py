from django.db import models

# Create your models here.

class User(models.Model):
    class Meta:
        app_label = "users"