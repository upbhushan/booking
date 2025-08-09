import { Navigate } from 'react-router-dom';

interface Props { isAuthed: boolean; role?: string; allow?: string[]; children: JSX.Element; }

// If role prop provided, user must match. If allow array provided, role must be in array.
export function ProtectedRoute({ isAuthed, role, allow, children }: Props) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (role && role !== (localStorage.getItem('role')||'')) return <Navigate to="/" replace />;
  if (allow && !allow.includes(localStorage.getItem('role')||'')) return <Navigate to="/" replace />;
  return children;
}
