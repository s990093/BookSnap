from rest_framework import viewsets
from .models import Country, Author, PostType, Post, Image
from .serializers import CountrySerializer, AuthorSerializer, PostTypeSerializer, PostSerializer, ImageSerializer
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.contrib import messages 
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
import os
import zipfile
from django.http import HttpResponse
from io import BytesIO, StringIO


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class PostTypeViewSet(viewsets.ModelViewSet):
    queryset = PostType.objects.all()
    serializer_class = PostTypeSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]

def upload_file(request):
    if request.method == 'POST':
        context = {
            'post_types': PostType.objects.all(),
            'countries': Country.objects.all(),
            'authors': Author.objects.all(),
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
    }
    return render(request, 'upload.html', context)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def api_create_post(request):
    try:
        # 獲取表單數據
        post_type_id = request.data.get('post_type')
        country_id = request.data.get('country')
        author_id = request.data.get('author')
        content = request.data.get('content')
        title = request.data.get('title')

        # 驗證必要欄位
        if not all([post_type_id, content, title]):
            return Response({
                'error': '請填寫所有必要欄位'
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
            user=request.user if request.user.is_authenticated else None
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
        'post_types': PostType.objects.all(),
        'countries': Country.objects.all(),
        'has_more': total_posts > end,
        'current_page': page,
    }
    
    return render(request, 'post_list.html', context)

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

def download_posts(request):
    post_ids = request.GET.get('ids', '').split(',')
    
    try:
        # 创建一个临时的ZIP文件
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for post_id in post_ids:
                try:
                    post = Post.objects.get(id=post_id)
                    
                    # 为每个帖子创建一个文件夹
                    folder_name = f'post_{post_id}'
                    
                    # 添加文本内容
                    content_file = StringIO()
                    content_file.write(f"Post Type: {post.post_type.name}\n")
                    content_file.write(f"Content: {post.content}\n")
                    if post.country:
                        content_file.write(f"Country: {post.country.name}\n")
                    if post.author:
                        content_file.write(f"Author: {post.author.name}\n")
                    
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