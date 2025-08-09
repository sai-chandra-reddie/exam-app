import axios from 'axios';
import { AuthResponse, LoginForm, RegisterForm, Question, ExamSubmission, ExamResult } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: RegisterForm) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export const examAPI = {
  startExam: async (): Promise<Question[]> => {
    const response = await api.get('/exams/start');
    return response.data;
  },

  submitExam: async (data: ExamSubmission) => {
    const response = await api.post('/exams/submit', data);
    return response.data;
  },

  getResults: async (examId: number): Promise<ExamResult> => {
    const response = await api.get(`/exams/results/${examId}`);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/exams/history');
    return response.data;
  },
};

export default api;
