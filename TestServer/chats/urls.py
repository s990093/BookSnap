from django.urls import path
from .views import MessageListView,ConversationView

urlpatterns = [
    path('messages/', MessageListView.as_view(), name='message-list'),
    path('messages/<int:user_id>/', ConversationView.as_view(), name='conversation'),
]

