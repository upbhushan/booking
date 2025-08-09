import { useEffect, useState } from 'react';
import { api } from '../api';

function formatDate(d: Date) { return d.toISOString().slice(0,10); }

export function Dashboard({ auth }: any) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.token) return; // protected route should redirect, guard anyway
    (async () => {
      setLoading(true); setError(null);
      const today = new Date();
      const to = new Date(today.getTime() + 6*24*60*60*1000);
      try { setSlots(await api.getSlots(formatDate(today), formatDate(to))); }
      catch (e: any) { setError(e.response?.data?.error?.message || 'Failed to load'); }
      finally { setLoading(false); }
    })();
  }, [auth.token]);

  async function book(id: string) {
    try { await api.book(id); setSlots(slots.filter(s=>s.id!==id)); }
    catch (e: any) { alert(e.response?.data?.error?.message || 'Booking failed'); }
  }

  return (
  <div className="space-y-6 panel p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Available <span className="text-brand">Slots</span></h1>
        <div className="text-xs text-gray-500">Showing next 7 days</div>
      </div>
      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {loading && Array.from({length:10}).map((_,i)=>(
          <div key={i} className="h-20 rounded-xl bg-gradient-to-br from-brand-light to-white animate-pulse border border-brand/20" />
        ))}
        {!loading && slots.map(s => {
          const date = new Date(s.startAt);
          const prettyDay = date.toLocaleDateString(undefined,{ weekday:'short', month:'short', day:'numeric'});
          const time = date.toLocaleTimeString(undefined,{ hour:'2-digit', minute:'2-digit'});
          return (
            <div key={s.id} className="group relative card p-3 flex flex-col">
              <div className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">{prettyDay}</div>
              <div className="mt-0.5 font-semibold text-sm md:text-base text-gray-800">{time}</div>
              <button onClick={()=>book(s.id)} className="mt-auto text-xs md:text-sm inline-flex justify-center items-center gap-1 rounded-md bg-brand text-white px-2.5 py-1.5 hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/40">
                Book
              </button>
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-brand/30 pointer-events-none" />
            </div>
          );
        })}
      </div>
      {!loading && slots.length===0 && <div className="text-sm text-gray-600 bg-white border rounded-md p-4">No slots available. Check back later.</div>}
    </div>
  );
}
