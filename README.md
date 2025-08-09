# Appointment Booking App

Tech: Node.js (Express) + Prisma + PostgreSQL + React (Vite) + Tailwind.

## Submission Checklist

- Frontend URL: https://booking-wundersight.vercel.app
- API URL: https://booking-6.onrender.com
- Patient: patient@example.com / Passw0rd!
- Admin: admin@example.com / Passw0rd!
- Repo URL: https://github.com/upbhushan/booking
- Run locally: README steps verified
- Postman/curl steps included

## Backend
`cd backend`
1. Copy `.env.example` to `.env` and set `DATABASE_URL` (Neon/Railway), `JWT_SECRET`.
2. Install deps & generate client:
```
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```
API runs on `http://localhost:4000`.

### Endpoints
- POST /api/register {name,email,password}
- POST /api/login {email,password} -> {token, role}
- GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD (auth)
- POST /api/book/:slotId (auth)
- GET /api/my-bookings (auth)
- GET /api/all-bookings (admin)

### Error Example
```
{ "error": { "code": "SLOT_TAKEN", "message": "Slot already booked" } }
```

## Frontend
`cd frontend`
```
npm install
npm run dev
```
Set `VITE_API_URL` in `.env` if different.

## Seed Users
Admin: `admin@example.com / Passw0rd!`
Create a patient via register or manually seed similar.

## Deployment (example quick path)
- DB: Neon free Postgres: create DB, get connection string.
- API: Render (Node) – set env vars, build runs `npm i && npx prisma migrate deploy && npm run start`.
- Frontend: Vercel – set `VITE_API_URL` to Render API URL, redeploy.

## Curl Verification
```
# Register
curl -X POST %API%/register -H "Content-Type: application/json" -d '{"name":"Pat","email":"patient@example.com","password":"Passw0rd!"}'
# Login
TOKEN=$(curl -s -X POST %API%/login -H "Content-Type: application/json" -d '{"email":"patient@example.com","password":"Passw0rd!"}' | jq -r .token)
# Slots
curl -H "Authorization: Bearer $TOKEN" "%API%/slots?from=2025-08-07&to=2025-08-13"
# Book
FIRST=$(curl -s -H "Authorization: Bearer $TOKEN" "%API%/slots?from=2025-08-07&to=2025-08-13" | jq -r .slots[0].id)
curl -X POST -H "Authorization: Bearer $TOKEN" "%API%/book/$FIRST"
# My Bookings
curl -H "Authorization: Bearer $TOKEN" "%API%/my-bookings"
```

## Notes / Trade-offs
- Minimal validation (zod) and simple error shapes.
- Booking uniqueness enforced with unique constraint on Booking.slotId.
- Concurrency safe via DB constraint (retry would show SLOT_TAKEN).
- Could add rate limiting & refresh tokens with more time.
