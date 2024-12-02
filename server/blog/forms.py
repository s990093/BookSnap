from django import forms
from .models import Post, Image

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['post_type', 'content', 'images', 'country', 'author']  # 要在表單中顯示的字段

    # 添加圖片字段
    images = forms.ModelMultipleChoiceField(
        queryset=Image.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple,
        label="Select Images"
    )