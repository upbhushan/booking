import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button } from '../components/Button';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'PATIENT'|'ADMIN'>('PATIENT');
  const [adminKey, setAdminKey] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(false);
    try {
  await api.register({ name, email, password, role, adminKey: role==='ADMIN'? adminKey : undefined });
      setSuccess(true);
      setTimeout(()=>navigate('/login'), 1000);
    } catch (e: any) {
      setError(e.response?.data?.error?.message || 'Register failed');
    }
  }
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 shadow rounded space-y-4">
      <h1 className="text-xl font-semibold">Register</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Registered! Redirecting...</div>}
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
      <div className="flex gap-4 items-center text-sm">
        <label className="flex items-center gap-1"><input type="radio" name="role" value="PATIENT" checked={role==='PATIENT'} onChange={()=>setRole('PATIENT')} /> Patient</label>
        <label className="flex items-center gap-1"><input type="radio" name="role" value="ADMIN" checked={role==='ADMIN'} onChange={()=>setRole('ADMIN')} /> Admin</label>
      </div>
      {role==='ADMIN' && <input value={adminKey} onChange={e=>setAdminKey(e.target.value)} placeholder="Admin Key" className="w-full border p-2 rounded" />}
  <Button full>Register</Button>
    </form>
  );
}
