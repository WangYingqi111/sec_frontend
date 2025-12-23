import axios from 'axios';

// 根据环境自动判断后端地址
// 开发时 (npm run dev): http://127.0.0.1:8000
// 生产时 (npm run build): 空字符串 (使用相对路径)
const BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : '';

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 请求超时时间
});

// 响应拦截器 (可选：统一处理错误)
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default service;