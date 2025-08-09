import axios from 'axios';

const instance = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' });

export const api = {
  setToken(token: string | null) { if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`; else delete instance.defaults.headers.common['Authorization']; },
  async register(data: { name: string; email: string; password: string; role?: string; adminKey?: string }) { return (await instance.post('/register', data)).data; },
  async login(data: { email: string; password: string }) { return (await instance.post('/login', data)).data as { token: string; role: string; name: string; email: string }; },
  async getSlots(from: string, to: string) { return (await instance.get('/slots', { params: { from, to } })).data.slots as any[]; },
  async book(slotId: string) { return (await instance.post(`/book/${slotId}`)).data; },
  async myBookings() { return (await instance.get('/my-bookings')).data.bookings as any[]; },
  async allBookings() { return (await instance.get('/all-bookings')).data.bookings as any[]; },
  async me() { return (await instance.get('/me')).data as { id: string; name: string; email: string; role: string }; },
};
