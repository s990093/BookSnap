from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, AuthorViewSet, PostTypeViewSet, PostViewSet, ImageViewSet, api_create_post, download_post

router = DefaultRouter()
router.register(r'countries', CountryViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'post-types', PostTypeViewSet)
router.register(r'posts', PostViewSet)
router.register(r'images', ImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-post/', api_create_post, name='create-post'),
    path('download-post/<int:post_id>/', download_post, name='download_post'),
]
