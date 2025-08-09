import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button } from '../components/Button';

export function Login({ auth }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
  const { token, role, name, email: em } = await api.login({ email, password });
  auth.login(token, role, name, em);
      navigate('/');
    } catch (e: any) {
      setError(e.response?.data?.error?.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white p-6 shadow rounded space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
	<input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
	<p className="text-xs text-gray-500">Use admin credentials to access admin area. (Seed default: admin@example.com)</p>
  <Button full>Login</Button>
    </form>
  );
}
