'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTodaySentence() {
    const today = new Date().toISOString().split('T')[0] + "T00:00:00.000Z"

    // Try to find exact match for today
    let sentence = await prisma.dailySentence.findUnique({
        where: {
            date: new Date(today),
        },
    })

    // Fallback: If no sentence for today (e.g. timezone diff), get the most recent one
    if (!sentence) {
        sentence = await prisma.dailySentence.findFirst({
            orderBy: {
                date: 'desc',
            },
        })
    }

    return sentence
}

export async function createPost(formData: FormData) {
    const content = formData.get('content') as string
    const authorId = formData.get('authorId') as string
    const sentenceId = formData.get('sentenceId') as string

    if (!content || content.length > 500) {
        return { error: "Content must be between 1 and 500 characters." }
    }

    try {
        // Ensure user exists (Anonymous ID)
        await prisma.user.upsert({
            where: { id: authorId },
            update: {},
            create: { id: authorId },
        })

        const post = await prisma.post.create({
            data: {
                content,
                authorId, // In a real app, strict auth. Here, trusted client/cookie ID.
                sentenceId,
            },
        })

        revalidatePath('/')
        return { success: true, post }
    } catch (error) {
        console.error("Failed to create post:", error)
        return { error: "Failed to submit post." }
    }
}

export async function getPosts(limit = 20) {
    return await prisma.post.findMany({
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            sentence: true,
            _count: {
                select: { likes: true, comments: true }
            }
        }
    })
}

export async function getUserPosts(userId: string) {
    return await prisma.post.findMany({
        where: {
            authorId: userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            sentence: true,
            _count: {
                select: { likes: true, comments: true }
            }
        }
    })
}

export async function likePost(postId: string, userId: string) {
    try {
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId },
        })

        await prisma.like.create({
            data: {
                postId,
                userId
            }
        })
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        return { error: "Already liked" }
    }
}
