import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const steps = [
  { title: 'Create / Login', desc: 'Register once or sign in.' },
  { title: 'Pick a Time', desc: 'Choose any free 30‑min slot this week.' },
  { title: 'Confirm Booking', desc: 'Instant reservation (no double booking).' },
  { title: 'Visit Clinic', desc: 'Come in at your confirmed time.' }
];

export function Landing({ auth }: any) {
  return (
    <div className="w-full">
  <section className="relative overflow-hidden panel rounded-none md:rounded-2xl md:mx-auto md:max-w-7xl mb-12 mt-0 md:mt-6">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
  <div className="px-6 py-14 md:py-20 md:px-16 grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          <div className="space-y-6 z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight gradient-text">
              wundersight – Simple In‑Person<br />Appointment Booking
            </h1>
            <p className="text-gray-600 max-w-md italic">Your health is an investment—reserve a time and we’ll be ready to help.</p>
            <div className="flex gap-4 flex-wrap items-center">
              {!auth?.token && (
                <>
                  <Link to="/register"><Button>Book a Slot</Button></Link>
                  <Link to="/login"><Button variant="outline">Login</Button></Link>
                </>
              )}
              {auth?.token && auth.role==='PATIENT' && (
                <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
              )}
              {auth?.token && auth.role==='ADMIN' && (
                <Link to="/admin"><Button>View All Bookings</Button></Link>
              )}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-brand/5 rounded-3xl rotate-6" />
            <div className="relative bg-white/70 backdrop-blur rounded-3xl p-8 ring-1 ring-brand/10 shadow-lg">
              <div className="space-y-4">
                <div className="h-4 w-32 bg-brand/20 rounded" />
                <div className="h-3 w-full bg-brand/10 rounded" />
                <div className="h-3 w-5/6 bg-brand/10 rounded" />
                <div className="grid grid-cols-3 gap-3 pt-4">
                  {[...Array(6)].map((_,i)=>(<div key={i} className="h-20 rounded-xl bg-gradient-to-br from-brand-light to-white ring-1 ring-brand/20" />))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  <section className="text-center mb-16 px-6 max-w-7xl mx-auto">
  <h2 className="text-2xl md:text-3xl font-bold mb-6">How It Works</h2>
  <p className="text-gray-600 max-w-2xl mx-auto mb-10">A lightweight flow for a small clinic.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s,i) => (
            <div key={s.title} className="relative p-6 bg-white rounded-xl shadow-sm border border-brand/10 hover:border-brand/30 hover:shadow-md transition group overflow-hidden">
              <div className="absolute -right-5 -top-5 w-16 h-16 rounded-full bg-brand-light/60 blur-xl opacity-0 group-hover:opacity-100 transition" />
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center mb-4 text-brand font-semibold ring-1 ring-brand/20 group-hover:scale-110 transition">{i+1}</div>
              <h3 className="font-semibold mb-1 text-gray-800 group-hover:text-brand transition">{s.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
