from django.contrib import admin
from .models import Message
# Register your models here.
@admin.register(Message)
class PostAdmin(admin.ModelAdmin):
    list_display = ('sender','receiver','content')
