from django.contrib import admin
from .models import Post, PostType, PostImage, Event, TemplateImage

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'created_at', 'updated_at')
    search_fields = ('title', 'content')
    list_filter = ('type', 'created_at')

@admin.register(PostType)
class PostTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)

@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'image_url', 'created_at')
    search_fields = ('post__title', 'alt_text')



@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date', 'time')
    search_fields = ('title', 'location')
    list_filter = ('date',)

@admin.register(TemplateImage)
class TemplateImageAdmin(admin.ModelAdmin):
    list_display = ('image_url', 'created_at')
    search_fields = ('description',) 