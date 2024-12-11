from rest_framework import viewsets
from .models import Country, Author, PostType, Post, Image, Reel
from .serializers import CountrySerializer, AuthorSerializer, PostTypeSerializer, PostSerializer, ImageSerializer, ReelSerializer
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib import messages 
from rest_framework.decorators import api_view, parser_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
import os
import zipfile
from django.http import HttpResponse
from io import BytesIO, StringIO
from django.db.models import Count
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth import logout
from django.db.models.functions import TruncWeek  #

class CountryViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class AuthorViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class PostTypeViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = PostType.objects.all()
    serializer_class = PostTypeSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class PostViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ImageViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class ReelViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@login_required
def upload_file(request):
    # 檢查用戶是否已登入
    if not request.user.is_authenticated:
        return redirect('login')
        
    if request.method == 'POST':
        context = {
            'post_types': PostType.objects.all(),
            'countries': Country.objects.all(),
            'authors': Author.objects.all(),
            'user': request.user,
        }

        if 'add_post_type' in request.POST:
            name = request.POST.get('post_type_name')
            if not name:
                messages.error(request, '文章類型名稱不能為空')
                context['post_type_error'] = '請輸入文章類型名稱'
            elif PostType.objects.filter(name=name).exists():
                messages.error(request, '此文章類型已存在')
                context['post_type_error'] = '此文章類型已存在'
            else:
                PostType.objects.create(name=name)
                messages.success(request, '文章類型新增成功')
                return HttpResponseRedirect(request.path)
            
        elif 'add_country' in request.POST:
            name = request.POST.get('country_name')
            if not name:
                messages.error(request, '國家名稱不能為空')
                context['country_error'] = '請輸入國家名稱'
            elif Country.objects.filter(name=name).exists():
                messages.error(request, '此國家已存在')
                context['country_error'] = '此國家已存在'
            else:
                Country.objects.create(name=name)
                messages.success(request, '國家新增成功')
                return HttpResponseRedirect(request.path)
            
        elif 'add_author' in request.POST:
            name = request.POST.get('author_name')
            if not name:
                messages.error(request, '作者名稱不能為空')
                context['author_error'] = '請輸入作者名稱'
            elif Author.objects.filter(name=name).exists():
                messages.error(request, '此作者已存在')
                context['author_error'] = '此作者已存在'
            else:
                Author.objects.create(name=name)
                messages.success(request, '作者新增成功')
                return HttpResponseRedirect(request.path)

        return render(request, 'upload.html', context)

    context = {
        'post_types': PostType.objects.all(),
        'countries': Country.objects.all(),
        'authors': Author.objects.all(),
        'user': request.user,
    }
    return render(request, 'upload_post.html', context)

@login_required
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@authentication_classes([SessionAuthentication, BasicAuthentication])
def api_create_post(request):
    try:
        # 確保用戶已登入
        if not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        # 獲取表單數據
        post_type_id = request.data.get('post_type')
        country_id = request.data.get('country')
        author_id = request.data.get('author')
        content = request.data.get('content')
        title = request.data.get('title')

        # 驗證必要欄位
        if not all([post_type_id, content, title]):
            return Response({
                'error': 'Please fill in all required fields'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 檢查標題是否重複
        if Post.objects.filter(title=title).exists():
            return Response({
                'error': '此標題已存在'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 創建貼文
        post = Post(
            post_type_id=post_type_id,
            country_id=country_id,
            author_id=author_id if author_id else None,
            content=content,
            title=title,
            user=request.user
        )
        post.save()

        # 處理圖片上傳
        images = request.FILES.getlist('images')
        for image_file in images:
            # 驗證圖片
            if not image_file.content_type.startswith('image/'):
                raise ValidationError('只能上傳圖片文件')
            
            # 創建圖片實例
            image = Image(image=image_file)
            image.save()
            post.images.add(image)

        return Response({
            'message': '貼文發布成功',
            'post_id': post.id
        }, status=status.HTTP_201_CREATED)

    except ValidationError as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'發生錯誤：{str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@login_required
def post_list(request):
    # Get filter parameters from URL
    post_type = request.GET.get('type')
    country = request.GET.get('country')
    page = int(request.GET.get('page', 1))
    posts_per_page = 20
    
    # Base queryset
    posts = Post.objects.all()
    
    # Apply filters if specified
    if post_type:
        posts = posts.filter(post_type__name=post_type)
    if country:
        posts = posts.filter(country__name=country)
    
    # Order by id (descending) instead of date
    posts = posts.order_by('-id')
    
    # Calculate total posts for pagination
    total_posts = posts.count()
    
    # Get paginated posts
    start = (page - 1) * posts_per_page
    end = page * posts_per_page
    posts = posts[start:end]
    
    context = {
        'posts': posts,
        'users': User.objects.all(), 
        'post_types': PostType.objects.all(),
        'countries': Country.objects.all(),
        'has_more': total_posts > end,
        'current_page': page,
    }
    
    return render(request, 'post_list.html', context)

@login_required
def download_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        
        # 创建一个临时的ZIP文件
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # 添加文本内容
            content_file = StringIO()
            content_file.write(f"Post Type: {post.post_type.name}\n")
            content_file.write(f"Content: {post.content}\n")
            if post.country:
                content_file.write(f"Country: {post.country.name}\n")
            if post.author:
                content_file.write(f"Author: {post.author.name}\n")
            
            zip_file.writestr('content.txt', content_file.getvalue())
            
            # 添加图片
            for i, image in enumerate(post.images.all()):
                image_path = image.image.path
                image_name = os.path.basename(image_path)
                zip_file.write(image_path, f'images/{image_name}')

        # 准备响应
        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="post_{post_id}.zip"'
        
        return response
        
    except Post.DoesNotExist:
        return HttpResponse('Post not found', status=404)

@login_required
def download_posts(request):
    post_ids = request.GET.get('ids', '').split(',')
    
    try:
        # 创建个临时的ZIP文件
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for post_id in post_ids:
                try:
                    post = Post.objects.get(id=post_id)
                    
                    # 为每个帖子创建一个文件夹
                    folder_name = f'{post.title}'
                    
                    # 添加文内容
                    content_file = StringIO() 
                    content_file.write(f"{post.content}")
                    zip_file.writestr(f'{folder_name}/content.txt', content_file.getvalue())
                    
                    # 添加图片
                    for i, image in enumerate(post.images.all()):
                        image_path = image.image.path
                        image_name = os.path.basename(image_path)
                        zip_file.write(image_path, f'{folder_name}/images/{image_name}')
                        
                except Post.DoesNotExist:
                    continue

        # 准备响应
        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="selected_posts.zip"'
        
        return response
        
    except Exception as e:
        return HttpResponse(f'Error: {str(e)}', status=500)

@login_required
def dashboard(request):
    # 獲取基礎數據
    total_posts = Post.objects.count()
    total_authors = Author.objects.count()
    total_countries = Country.objects.count()
    total_reels = Reel.objects.count()
    
    # 獲取最近一個月的數據
    last_month = timezone.now() - timedelta(days=30)
    recent_posts = Post.objects.filter(created_at__gte=last_month).count()
    recent_reels = Reel.objects.filter(created_at__gte=last_month).count()  # 新增：最近一個月的影片數量
    
    # 按文章類型統計
    posts_by_type = Post.objects.values('post_type__name')\
        .annotate(count=Count('id'))\
        .order_by('-count')
    
    # 按國家統計
    posts_by_country = Post.objects.values('country__name')\
        .annotate(count=Count('id'))\
        .order_by('-count')
    
    # 按月份統計文章數量
    posts_by_month = Post.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('-month')[:12]  # 最近12個月
    
    # 新增：獲取最近發布的文章
    recent_posts_list = Post.objects.select_related(
        'post_type', 'country', 'author', 'user'
    ).order_by('-created_at')[:10]
    
    # 新增：每個用戶的發文統計
    posts_by_user = Post.objects.values('user__username')\
        .annotate(count=Count('id'))\
        .order_by('-count')[:10]
    
    # 新增：含圖片最多的文章
    posts_with_most_images = Post.objects.annotate(
        image_count=Count('images')
    ).order_by('-image_count')[:5]
    
    # 獲取本週開始時間
    today = timezone.now()
    week_start = today - timedelta(days=today.weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)

    # 統計本週的文章和影片數量
    posts_this_week = Post.objects.filter(
        created_at__gte=week_start
    ).count()

    reels_this_week = Reel.objects.filter(
        created_at__gte=week_start
    ).count()
    
    # 最活躍的作者
    top_authors = Author.objects.annotate(
        post_count=Count('post')
    ).order_by('-post_count')[:5]
    
    recent_reels_list = Reel.objects.select_related('user').order_by('-created_at')[:10]
    
    # 獲取最近52週的文章和影片統計
    one_year_ago = timezone.now() - timedelta(days=365)
    
    posts_by_week = Post.objects.filter(
        created_at__gte=one_year_ago
    ).annotate(
        week=TruncWeek('created_at')
    ).values('week').annotate(
        count=Count('id')
    ).order_by('-week')

    reels_by_week = Reel.objects.filter(
        created_at__gte=one_year_ago
    ).annotate(
        week=TruncWeek('created_at')
    ).values('week').annotate(
        count=Count('id')
    ).order_by('-week')

    context = {
        'total_posts': total_posts,
        'total_authors': total_authors,
        'total_countries': total_countries,
        'total_reels': total_reels,
        'recent_posts': recent_posts,
        'recent_reels': recent_reels,  
        'posts_by_type': posts_by_type,
        'posts_by_country': posts_by_country,
        'posts_by_month': posts_by_month,
        'posts_this_week': posts_this_week,
        'reels_this_week': reels_this_week,
        'top_authors': top_authors,
        'recent_posts_list': recent_posts_list,
        'posts_by_user': posts_by_user,
        'posts_with_most_images': posts_with_most_images,
        'recent_reels_list': recent_reels_list, 
        'posts_by_week': posts_by_week,
        'reels_by_week': reels_by_week,
    }
    
    return render(request, 'dashboard.html', context)

@login_required
def create_reel(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        video = request.FILES.get('video')
        content = request.POST.get('content')
        
        reel = Reel.objects.create(
            title=title,
            video=video,
            content=content,
            user=request.user
        )
        
        messages.success(request, '影片上傳成功！')
        return redirect('reel_list')  
        
    return render(request, 'create_reel.html')

@login_required
def reel_list(request):
    # Get filter parameters from URL
    page = int(request.GET.get('page', 1))
    reels_per_page = 20
    
    # Base queryset
    reels = Reel.objects.all()
    
    # Order by created_at (descending)
    reels = reels.order_by('-created_at')
    
    # Calculate total reels for pagination
    total_reels = reels.count()
    
    # Get paginated reels
    start = (page - 1) * reels_per_page
    end = page * reels_per_page
    reels = reels[start:end]
    
    context = {
        'reels': reels,
        'has_more': total_reels > end,
        'current_page': page,
    }
    
    return render(request, 'reel_list.html', context)

@login_required
def download_images(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    images = post.images.all()

    # Create a zip file in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        for image in images:
            # Assuming image.url is the path to the image file
            image_path = image.image.path
            zip_file.write(image_path, os.path.basename(image_path))

    # Set the response
    response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
    response['Content-Disposition'] = f'attachment; filename={post.title}_images.zip'

    return response

def logout_view(request):
    logout(request)
    return redirect('login')