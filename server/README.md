# Blog Backend API

## API 端點

### Posts

- `GET /api/posts/` - 獲取所有貼文
- `POST /api/posts/` - 創建新貼文
- `GET /api/posts/{id}/` - 獲取特定貼文
- `PUT /api/posts/{id}/` - 更新特定貼文
- `DELETE /api/posts/{id}/` - 刪除特定貼文
- `GET /api/posts/recent/` - 獲取最近 5 篇貼文
- `GET /api/posts/by_type/?type_id={id}` - 獲取特定類型的貼文

### Post Types

- `GET /api/post-types/` - 獲取所有貼文類型
- `POST /api/post-types/` - 創建新貼文類型
- `GET /api/post-types/{id}/` - 獲取特定貼文類型
- `PUT /api/post-types/{id}/` - 更新特定貼文類型
- `DELETE /api/post-types/{id}/` - 刪除特定貼文類型

## 數據模型

### PostType

- name: 類型名稱
- description: 類型描述
- created_at: 創建時間
- updated_at: 更新時間

### Post

- title: 標題
- content: 內容
- type: 關聯的貼文類型
- artist: 音樂家（音樂類型用）
- album: 專輯（音樂類型用）
- music_url: 音樂連結
- author: 作者（書籍類型用）
- book_description: 書籍描述
- cover_image: 封面圖片
- location: 地點（活動類型用）
- event_date: 活動日期
- event_time: 活動時間
- images: 圖片 URL 列表
- created_at: 創建時間
- updated_at: 更新時間

## 注意事項

1. 所有時間都使用 UTC
2. 圖片 URL 需要是完整的 URL 地址
3. API 回應格式統一為 JSON
4. 所有 API 端點都需要在路徑前加上 `/api/`
