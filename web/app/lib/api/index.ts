import axios from 'axios';

// 創建 axios 實例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

// 導出所有 API 函數
export * from './posts';
export * from './events';
export * from './postTypes';
export * from './templates';

// 導出 API 實例以供直接使用
export { api };

// 全局錯誤處理
api.interceptors.response.use(
  response => response,
  error => {
    // 處理 401 未授權
    if (error.response?.status === 401) {
      // 處理登出邏輯
    }
    
    // 處理 404 找不到資源
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    }
    
    // 處理 500 伺服器錯誤
    if (error.response?.status >= 500) {
      console.error('Server error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API 狀態檢查
export async function checkApiHealth() {
  try {
    await api.get('/health-check/');
    return true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

// 通用的分頁參數類型
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// 通用的響應類型
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
} 