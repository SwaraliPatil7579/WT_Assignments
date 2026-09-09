import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

/* ── Students ── */
export const getStudents = () => api.get('/students').then(r => r.data);
export const getStudent = (regNo) => api.get(`/students/${regNo}`).then(r => r.data);
export const createStudent = (data) => api.post('/students', data).then(r => r.data);

/* ── Subjects ── */
export const getSubjects = () => api.get('/subjects').then(r => r.data);

/* ── Marks ── */
export const saveMarks = (data) => api.post('/marks', data).then(r => r.data);

/* ── Result ── */
export const getResult = (regNo) => api.get(`/result/${regNo}`).then(r => r.data);

export default api;
