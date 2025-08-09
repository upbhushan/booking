import { useEffect, useState } from 'react';
import { api } from '../api';

export function Admin({ auth }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (auth.role==='ADMIN') {
    (async () => { setLoading(true); try { setBookings(await api.allBookings()); } finally { setLoading(false); } })();
  } }, [auth.role]);

  if (auth.role !== 'ADMIN') return <div>Not authorized.</div>;

  return (
  <div className="space-y-6 panel p-6">
      <h1 className="text-2xl font-bold tracking-tight">All <span className="text-brand">Bookings</span></h1>
  {loading && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({length:8}).map((_,i)=>(<div key={i} className="h-24 rounded-xl bg-gradient-to-br from-brand-light to-white animate-pulse border border-brand/20" />))}</div>}
      {!loading && bookings.length>0 && (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookings.map(b => {
            const d = new Date(b.slot.startAt);
            return (
              <div key={b.id} className="card p-4 flex flex-col text-sm">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'})}</div>
                <div className="mt-0.5 font-semibold text-gray-800">{d.toLocaleTimeString(undefined,{hour:'2-digit', minute:'2-digit'})}</div>
                <div className="mt-2 text-xs text-gray-600 font-medium flex items-center gap-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-light text-[10px] text-brand font-semibold">{b.user.name?.[0]||'U'}</span>
                  <span className="truncate" title={b.user.email}>{b.user.name} · {b.user.email}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && bookings.length===0 && <div className="text-sm text-gray-600 bg-white border rounded-md p-4">No bookings yet.</div>}
    </div>
  );
}
