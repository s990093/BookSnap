from django.contrib import admin
from .models import Country, Author, PostType, Post, Image

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(PostType)
class PostTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'post_type', 'country', 'user')
    search_fields = ('title', 'content')
    list_filter = ('post_type', 'country', 'author')
    filter_horizontal = ('images',)

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image')
