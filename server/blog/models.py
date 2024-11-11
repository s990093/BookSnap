from django.db import models
from django.utils import timezone

class PostType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    tag = models.TextField(blank=True)
    type = models.ForeignKey(PostType, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/%Y/%m/%d/')
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Image for {self.post.title}"

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