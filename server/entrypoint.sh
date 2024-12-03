#!/bin/bash

# 等待數據庫
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database started"

# 執行數據庫遷移
python manage.py migrate

# 收集靜態文件
python manage.py collectstatic --noinput

# 啟動服務器
python manage.py runserver 0.0.0.0:8000 