
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Connection successful. Total users in production database: ${userCount}`);

        const mockUsers = await prisma.user.findMany({
            where: {
                name: {
                    startsWith: 'User_'
                }
            },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        console.log(`Users starting with 'User_': ${mockUsers.length}`);
        mockUsers.forEach(u => console.log(` - ${u.name} (Posts: ${u._count.posts})`));

    } catch (error) {
        console.error('Failed to connect to production database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
