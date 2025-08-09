import { useEffect, useState } from 'react';
import { api } from '../api';

export function MyBookings({ auth }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try { setBookings(await api.myBookings()); } finally { setLoading(false); }
    }
    load();
  }, [auth.token]);

  return (
  <div className="space-y-6 panel p-6">
      <h1 className="text-2xl font-bold tracking-tight">My <span className="text-brand">Bookings</span></h1>
  {loading && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=>(<div key={i} className="h-20 rounded-xl bg-gradient-to-br from-brand-light to-white animate-pulse border border-brand/20" />))}</div>}
      {!loading && bookings.length>0 && (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookings.map(b => {
            const d = new Date(b.startAt);
            return (
              <div key={b.id} className="card p-4 flex flex-col">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'})}</div>
                <div className="mt-0.5 font-semibold text-sm md:text-base text-gray-800">{d.toLocaleTimeString(undefined,{hour:'2-digit', minute:'2-digit'})}</div>
                <div className="mt-auto pt-2 text-[11px] text-gray-400">Booked</div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && bookings.length===0 && <div className="text-sm text-gray-600 bg-white border rounded-md p-4">No bookings yet.</div>}
    </div>
  );
}
