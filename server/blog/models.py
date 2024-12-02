from django.db import models
from django.conf import settings

# 國家模型 (Country Model)
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# 作者模型 (Author Model)
class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"


# 發帖類型模型 (PostType Model)
class PostType(models.Model):
    name = models.CharField(max_length=50, unique=True)  # 發帖類型名稱

    def __str__(self):
        return self.name


# Post 模型
class Post(models.Model):
    title = models.CharField(max_length=200)  # 新增標題欄位
    post_type = models.ForeignKey(PostType, on_delete=models.SET_NULL, null=True)  # 外鍵指向 PostType 模型
    content = models.TextField()
    images = models.ManyToManyField('Image', blank=True)  
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)  # 用戶（外鍵指向 User 模型）
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)  # 國家（外鍵指向 Country 模型）
    author = models.ForeignKey(Author, null=True, blank=True, on_delete=models.SET_NULL)  # 作者（外鍵指向 Author 模型）
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post: {self.title} by {self.author or 'Unknown'}"

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        ordering = ['-created_at']
        


class Image(models.Model):
    image = models.ImageField(upload_to='posts/images/')
    
    def __str__(self):
        return f"Image {self.id}"

<<<<<<< HEAD
<<<<<<< HEAD
    @property
    def image_url(self):
        return self.image.url if self.image else None

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    time = models.TimeField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class TemplateImage(models.Model):
    image = models.ImageField(upload_to='template_images/%Y/%m/%d/')
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description

    @property
    def image_url(self):
        return self.image.url if self.image else None
=======
    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"


class Reel(models.Model):
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to='reels/videos/')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Reel: {self.title}"

    class Meta:
        verbose_name = "Reel"
        verbose_name_plural = "Reels"
<<<<<<< HEAD
        ordering = ['-created_at']
>>>>>>> 675d26b (reel model)
=======
        ordering = ['-created_at']
>>>>>>> 675d26b (reel model)
=======
    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
>>>>>>> ae2a2fd (new)
