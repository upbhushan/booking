import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth';
import { slotsRouter } from './routes/slots';
import { bookingsRouter } from './routes/bookings';
import { authenticate } from './middleware/auth';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.get('/health', (_req: any, res: any) => res.json({ ok: true }));

app.use('/api', authRouter);
app.use('/api', authenticate, slotsRouter);
app.use('/api', authenticate, bookingsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});
