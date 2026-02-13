import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sentences = [
    {
        date: new Date().toISOString().split('T')[0] + "T00:00:00.000Z", // Today
        content: "그는 비를 맞고 있었다.",
    },
    {
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0] + "T00:00:00.000Z", // Tomorrow
        content: "창문을 여니 봄 공기가 들어왔다.",
    },
    {
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + "T00:00:00.000Z", // Day after tomorrow
        content: "햇빛이 소나기처럼 쏟아졌다.",
    },
    {
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + "T00:00:00.000Z",
        content: "가로등 불빛이 하나둘 꺼지기 시작했다.",
    },
    {
        date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] + "T00:00:00.000Z",
        content: "오래된 책에서 낯선 향기가 났다.",
    }
]

async function main() {
    console.log(`Start seeding ...`)
    for (const s of sentences) {
        const sentence = await prisma.dailySentence.upsert({
            where: { date: new Date(s.date) },
            update: {
                content: s.content // Update existing content if date matches
            },
            create: {
                date: new Date(s.date),
                content: s.content,
            },
        })
        console.log(`Created/Updated sentence with id: ${sentence.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
