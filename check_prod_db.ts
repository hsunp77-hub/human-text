
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Connection successful. Total users in production database: ${userCount}`);

        const sentenceCount = await prisma.dailySentence.count();
        console.log(`Total sentences in production database: ${sentenceCount}`);

        if (sentenceCount > 0) {
            const sampleSentence = await prisma.dailySentence.findFirst({
                where: { dayIndex: 1, groupCode: 'G1' }
            });
            console.log(`Sample Sentence (Day 1, G1): ${sampleSentence?.content || 'NOT FOUND'}`);
        }

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
