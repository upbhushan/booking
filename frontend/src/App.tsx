import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Landing } from './pages/Landing';
import { MyBookings } from './pages/MyBookings';
import { Admin } from './pages/Admin';
import { api } from './api';
import { ProtectedRoute } from './ProtectedRoute';
import { Header } from './components/Header';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));
  const [name, setName] = useState<string | null>(() => localStorage.getItem('name'));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem('email'));
  const login = (t: string, r: string, n?: string, e?: string) => {
    setToken(t); setRole(r); if(n) setName(n); if(e) setEmail(e);
    localStorage.setItem('token', t); localStorage.setItem('role', r);
    if (n) localStorage.setItem('name', n); if (e) localStorage.setItem('email', e);
  };
  const logout = () => { setToken(null); setRole(null); setName(null); setEmail(null); localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('name'); localStorage.removeItem('email'); };
  return { token, role, name, email, login, logout };
}

// Nav replaced by Header component

export default function App() {
  const auth = useAuth();
  useEffect(() => { api.setToken(auth.token); if(auth.token && !auth.name){(async()=>{ try { const me = await api.me(); auth.login(auth.token!, me.role, me.name, me.email); } catch{} })(); } }, [auth.token]);
  return (
  <div className="min-h-screen flex flex-col">
  <Header auth={auth} />
  <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing auth={auth} />} />
          <Route path="/login" element={<div className='container mx-auto px-4 py-10'><Login auth={auth} /></div>} />
          <Route path="/register" element={<div className='container mx-auto px-4 py-10'><Register /></div>} />
          <Route path="/dashboard" element={<ProtectedRoute isAuthed={!!auth.token} allow={['PATIENT']}><div className='container mx-auto px-4 py-10'><Dashboard auth={auth} /></div></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute isAuthed={!!auth.token} allow={['PATIENT']}><div className='container mx-auto px-4 py-10'><MyBookings auth={auth} /></div></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute isAuthed={!!auth.token} allow={['ADMIN']}><div className='container mx-auto px-4 py-10'><Admin auth={auth} /></div></ProtectedRoute>} />
        </Routes>
      </main>
  <footer className="mt-auto py-10 bg-slate-900/80 backdrop-blur border-t border-slate-800 text-slate-400 text-[15px]">
    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-10 md:items-start">
  <div className="flex-1 min-w-[200px]">
    <div className="font-semibold text-slate-100 mb-2 text-lg">wundersight</div>
    <p className="text-sm leading-relaxed max-w-sm text-slate-400">Simple in‑person appointment booking for your local clinic.</p>
      </div>
      <div className="flex-1 min-w-[220px]">
    <div className="font-medium text-slate-100 mb-2 text-base">Contact</div>
    <ul className="text-sm space-y-1.5 text-slate-400">
          <li>Wundersight Clinic</li>
          <li>2nd Floor, Shankar Nagar Road</li>
          <li>Nagpur, Maharashtra 440010, India</li>
          <li>Phone: +91 712-123-4567</li>
        </ul>
      </div>
      <div className="flex-1 min-w-[160px]">
    <div className="font-medium text-slate-100 mb-2 text-base">Support</div>
    <ul className="text-sm space-y-1.5 text-slate-400">
          <li>Email: support@wundersight.example</li>
          <li>Hours: 9:00 – 17:00 IST</li>
        </ul>
      </div>
    </div>
  <div className="mt-8 text-center text-xs text-slate-600 tracking-wide">© {new Date().getFullYear()} wundersight. All rights reserved.</div>
  </footer>
    </div>
  );
}
