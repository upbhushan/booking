import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './Button';

interface Props { auth: any; }

export function Header({ auth }: Props) {
  const [open, setOpen] = useState(false);
  const linkCls = (isActive: boolean) => "block px-3 py-2 rounded-md text-sm " + (isActive ? "bg-brand text-white md:bg-transparent md:text-brand font-medium" : "text-gray-600 hover:text-brand");
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 items-center gap-5">
        <Link to="/" className="font-bold text-brand text-xl md:text-2xl tracking-tight">wundersight</Link>
        <button onClick={()=>setOpen(o=>!o)} className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100" aria-label="Toggle menu">
          <span className="i">{open? '✕':'☰'}</span>
        </button>
        <nav className="hidden md:flex items-center gap-6 text-[15px] md:text-base font-medium">
          <NavLink to="/" className={({isActive})=>"transition " + (isActive?"text-brand":"text-gray-700 hover:text-brand")}>Home</NavLink>
          {auth.token && auth.role==='PATIENT' && <NavLink to="/dashboard" className={({isActive})=>"transition " + (isActive?"text-brand":"text-gray-700 hover:text-brand")}>Dashboard</NavLink>}
          {auth.token && auth.role==='PATIENT' && <NavLink to="/my-bookings" className={({isActive})=>"transition " + (isActive?"text-brand":"text-gray-700 hover:text-brand")}>My Bookings</NavLink>}
          {auth.role==='ADMIN' && <NavLink to="/admin" className={({isActive})=>"transition " + (isActive?"text-brand":"text-gray-700 hover:text-brand")}>All Bookings</NavLink>}
        </nav>
        <div className="ml-auto hidden md:flex items-center gap-5">
          {!auth.token && (
            <>
              <Link to="/login"><Button variant="ghost" small>Login</Button></Link>
              <Link to="/register"><Button small>Sign Up</Button></Link>
            </>
          )}
          {auth.token && (
            <>
              <span className="text-base text-gray-700 max-w-[160px] truncate" title={`${auth.name||''} (${auth.email||''})`}>{auth.name || auth.email}</span>
              <Button small variant="outline" onClick={auth.logout}>Logout</Button>
            </>
          )}
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur">
          <div className="px-4 py-3 space-y-1">
            <NavLink onClick={()=>setOpen(false)} to="/" className={({isActive})=>linkCls(isActive).replace('text-sm','text-base')}>Home</NavLink>
            {auth.token && auth.role==='PATIENT' && <NavLink onClick={()=>setOpen(false)} to="/dashboard" className={({isActive})=>linkCls(isActive).replace('text-sm','text-base')}>Dashboard</NavLink>}
            {auth.token && auth.role==='PATIENT' && <NavLink onClick={()=>setOpen(false)} to="/my-bookings" className={({isActive})=>linkCls(isActive).replace('text-sm','text-base')}>My Bookings</NavLink>}
            {auth.role==='ADMIN' && <NavLink onClick={()=>setOpen(false)} to="/admin" className={({isActive})=>linkCls(isActive).replace('text-sm','text-base')}>All Bookings</NavLink>}
            <div className="pt-2 flex gap-3">
              {!auth.token && <Link to="/login" onClick={()=>setOpen(false)}><Button small variant="ghost">Login</Button></Link>}
              {!auth.token && <Link to="/register" onClick={()=>setOpen(false)}><Button small>Sign Up</Button></Link>}
              {auth.token && <div className="flex items-center gap-2"><span className="text-sm text-gray-600 truncate" style={{maxWidth:'120px'}}>{auth.name || auth.email}</span><Button small variant="outline" onClick={()=>{auth.logout(); setOpen(false);}}>Logout</Button></div>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
