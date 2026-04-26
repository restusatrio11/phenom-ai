const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@phenom.ai';
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (user) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log(`User ${email} has been promoted to ADMIN`);
  } else {
    console.log(`User ${email} not found`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
