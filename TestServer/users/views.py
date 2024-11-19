from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from django.db import models
from .serializers import RegisterSerializer, LoginResponseSerializer, UserSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework_simplejwt.views import TokenRefreshView

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully."})
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            data = {
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data)
        return Response({"error": "Invalid credentials"}, status=401)

class UserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # You can add custom validation logic here
        refresh_token = request.data.get('refresh', None)
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Call the original implementation for token refreshing
        response = super().post(request, *args, **kwargs)

        # Add custom response data
        if response.status_code == 200:
            response.data.update({
                "message": "Access token refreshed successfully",
            })

        return response