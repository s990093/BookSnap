from rest_framework import serializers
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
from .models import PostType, Post, PostImage, Event, TemplateImage
from django.utils import timezone
=======
=======
>>>>>>> 675d26b (reel model)
from .models import Country, Author, PostType, Post, Image, Reel
=======
from .models import Country, Author, PostType, Post, Image
>>>>>>> ae2a2fd (new)

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

<<<<<<< HEAD
>>>>>>> 675d26b (reel model)
=======
>>>>>>> ae2a2fd (new)

class PostTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostType
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
<<<<<<< HEAD
<<<<<<< HEAD
        fields = ['id', 'title', 'content', 'tag', 'type', 
                 'created_at', 'updated_at', 'images', 'uploaded_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        post = Post.objects.create(**validated_data)
        
        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)
        
        return post

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Update post fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Add new images
        for image in uploaded_images:
            PostImage.objects.create(post=instance, image=image)
        
        return instance 

=======
        fields = ['id', 'title', 'post_type', 'content', 'images', 'user', 'country', 'author']
        read_only_fields = ['user']


class ReelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reel
<<<<<<< HEAD
        fields = ['id', 'title', 'video', 'content', 'user', 'created_at']
>>>>>>> 675d26b (reel model)
=======
        fields = ['id', 'title', 'video', 'content', 'user', 'created_at']
>>>>>>> 675d26b (reel model)
=======
        fields = ['id', 'title', 'post_type', 'content', 'images', 'user', 'country', 'author']
        read_only_fields = ['user']
>>>>>>> ae2a2fd (new)
