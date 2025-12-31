// src/api/request.ts
import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000' : '';

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
});

service.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err)
);

export default service;
