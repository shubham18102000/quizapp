import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  sendOTP: (email) => apiClient.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp, name) => apiClient.post('/auth/verify-otp', { email, otp, name }),
  getMe: () => apiClient.get('/auth/me'),
};

// Quiz endpoints
export const quizAPI = {
  getSubjects: () => apiClient.get('/quiz/subjects'),
  getQuestions: (subject) => apiClient.get(`/quiz/questions/${subject}`),
  submitQuiz: (subject, answers) => apiClient.post('/quiz/submit', { subject, answers }),
  getHistory: () => apiClient.get('/quiz/history'),
};

// Leaderboard endpoints
export const leaderboardAPI = {
  getLeaderboard: (subject) => apiClient.get(`/leaderboard/${subject}`),
};

// Study material endpoints
export const studyMaterialAPI = {
  getMaterials: (subject) => apiClient.get(`/study-material/${subject}`),
  getMaterial: (id) => apiClient.get(`/study-material/detail/${id}`),
};

// Admin endpoints
export const adminAPI = {
  addQuestion: (data) => apiClient.post('/admin/questions', data),
  getQuestions: () => apiClient.get('/admin/questions'),
  deleteQuestion: (id) => apiClient.delete(`/admin/questions/${id}`),
  addStudyMaterial: (data) => apiClient.post('/admin/study-materials', data),
  deleteStudyMaterial: (id) => apiClient.delete(`/admin/study-materials/${id}`),
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (id, role) => apiClient.put(`/admin/users/${id}/role`, { role }),
};

export default apiClient;
