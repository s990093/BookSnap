from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from django.db import models
from .serializers import  UserSerializer,MessageSerializer
from .models import Message
from django.contrib.auth.models import User
from django.db.models import Q


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetch all messages involving the authenticated user."""
        messages = Message.objects.filter(Q(sender=request.user) | Q(receiver=request.user))
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class ConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Fetch all messages between the authenticated user and another user."""
        messages = Message.objects.filter(
            (models.Q(sender=request.user, receiver_id=user_id) |
             models.Q(sender_id=user_id, receiver=request.user))
        ).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, user_id):
        """Send a message to another user."""
        receiver = User.objects.get(id=user_id)
        message = Message.objects.create(
            sender=request.user,
            receiver=receiver,
            content=request.data.get('content')
        )
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)