import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    const firstUser = users[0];
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { role: 'ADMIN' }
    });
    console.log(`User ${firstUser.email} promoted to ADMIN`);
  } else {
    console.log('No users found to promote');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
