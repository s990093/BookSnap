from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Post, PostType, PostImage, Event, TemplateImage
from .serializers import (
    PostSerializer, PostTypeSerializer, PostImageSerializer,
    EventSerializer, TemplateImageSerializer
)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=False, methods=['GET'])
    def recent(self, request):
        recent_posts = Post.objects.order_by('-created_at')[:5]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # 處理多個圖片上傳
        images = request.FILES.getlist('images')
        data = request.data.dict()
        data['uploaded_images'] = images
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # 處理多個圖片上傳
        images = request.FILES.getlist('images')
        data = request.data.dict()
        data['uploaded_images'] = images
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

class PostTypeViewSet(viewsets.ModelViewSet):
    queryset = PostType.objects.all()
    serializer_class = PostTypeSerializer

class PostImageViewSet(viewsets.ModelViewSet):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    parser_classes = (MultiPartParser, FormParser)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=False, methods=['GET'])
    def upcoming(self, request):
        upcoming_events = Event.objects.filter(
            date__gte=timezone.now()
        ).order_by('date', 'time')[:5]
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

class TemplateImageViewSet(viewsets.ModelViewSet):
    queryset = TemplateImage.objects.all()
    serializer_class = TemplateImageSerializer 