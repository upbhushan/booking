import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.warn('Skipping admin user creation: ADMIN_EMAIL or ADMIN_PASSWORD not set');
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: 'ADMIN', name: 'Admin' },
      create: { email: adminEmail, passwordHash, role: 'ADMIN', name: 'Admin' }
    });
  }

  // generate slots for next 7 days 09:00-17:00 30-min
  const startHour = 9;
  const endHour = 17;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let day = 0; day < 7; day++) {
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const start = new Date(today.getTime() + day * 24 * 60 * 60 * 1000);
        start.setHours(h, m, 0, 0);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        try {
          await prisma.slot.create({ data: { startAt: start, endAt: end } });
        } catch { /* ignore duplicates */ }
      }
    }
  }
  console.log('Seed complete');
}

main().finally(()=>prisma.$disconnect());
