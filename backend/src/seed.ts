import bcrypt from 'bcryptjs';
import { prisma } from './db/prisma';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const admin = await prisma.admin.upsert({
    where:  { username },
    update: { password_hash: await bcrypt.hash(password, 10) },
    create: { username, password_hash: await bcrypt.hash(password, 10) },
  });

  console.log(`✅ Admin "${admin.username}" seeded.`);
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
