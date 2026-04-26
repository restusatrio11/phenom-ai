import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const regions = [
    { label: 'Sumatera Utara', code: '12' },
  ];

  console.log('Clearing existing regions and users...');
  await prisma.region.deleteMany();
  await prisma.user.deleteMany();

  console.log('Start seeding regions...');
  for (const r of regions) {
    const region = await prisma.region.create({
      data: r,
    });
    console.log(`Created region: ${region.label}`);
  }

  console.log('Creating superadmin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@phenom.ai',
      password: 'superadmin123', // In production, use hashed passwords!
      nama_lengkap: 'Super Admin Phenom',
      role: 'superadmin'
    }
  });
  console.log(`Created admin: ${admin.email}`);
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
