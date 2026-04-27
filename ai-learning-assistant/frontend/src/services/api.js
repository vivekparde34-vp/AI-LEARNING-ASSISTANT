import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// Documents
export const documentAPI = {
  upload: (formData) => api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/documents'),
  getOne: (id) => api.get(`/documents/${id}`),
  delete: (id) => api.delete(`/documents/${id}`),
};

// AI
export const aiAPI = {
  generateFlashcards: (docId, count) => api.post(`/ai/flashcards/${docId}`, { count }),
  generateQuiz: (docId, count) => api.post(`/ai/quiz/${docId}`, { count }),
  generateSummary: (docId) => api.post(`/ai/summary/${docId}`),
  explainConcept: (docId, concept) => api.post(`/ai/explain/${docId}`, { concept }),
  chat: (docId, message) => api.post(`/ai/chat/${docId}`, { message }),
  getChatHistory: (docId) => api.get(`/ai/chat/${docId}/history`),
};

// Flashcards
export const flashcardAPI = {
  getAll: (params) => api.get('/flashcards', { params }),
  getByDocument: (docId) => api.get(`/flashcards/document/${docId}`),
  review: (id) => api.patch(`/flashcards/${id}/review`),
  toggleFavorite: (id) => api.patch(`/flashcards/${id}/favorite`),
  delete: (id) => api.delete(`/flashcards/${id}`),
};

// Quizzes
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getByDocument: (docId) => api.get(`/quizzes/document/${docId}`),
  getOne: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  delete: (id) => api.delete(`/quizzes/${id}`),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};
