const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const count = await prisma.user.count();
    console.log('User count:', count);
    const userNames = await prisma.user.findMany({
        select: { name: true },
        where: { name: { startsWith: 'User_' } }
    });
    console.log('User names starting with User_:', userNames.map(u => u.name));
    await prisma.$disconnect();
}

check();
