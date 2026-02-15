'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DAILY_PROMPTS } from './sentences'

export async function ensureDailySentences() {
    // We'll map Day 1-10 to some fixed dates starting from 2026-02-01
    // This ensures they are in the DB and have stable IDs
    for (let i = 0; i < DAILY_PROMPTS.length; i++) {
        const date = new Date(`2026-02-${(i + 1).toString().padStart(2, '0')}T00:00:00.000Z`);
        await prisma.dailySentence.upsert({
            where: { date },
            update: { content: DAILY_PROMPTS[i] },
            create: {
                date,
                content: DAILY_PROMPTS[i]
            }
        });
    }
}

export async function getSentenceByDay(day: number) {
    // Validate day is within valid range
    if (day < 1 || day > DAILY_PROMPTS.length) {
        console.error(`Invalid day number: ${day}. Valid range is 1-${DAILY_PROMPTS.length}`);
        return null;
    }

    const date = new Date(`2026-02-${day.toString().padStart(2, '0')}T00:00:00.000Z`);
    const content = DAILY_PROMPTS[day - 1];

    // Try to find it, or create it if missing (Self-healing)
    let sentence = await prisma.dailySentence.findUnique({
        where: { date }
    });

    if (!sentence) {
        try {
            sentence = await prisma.dailySentence.upsert({
                where: { date },
                update: { content },
                create: {
                    date,
                    content
                }
            });
        } catch (error) {
            console.error(`Failed to ensure sentence for day ${day}:`, error);
        }
    }

    return sentence;
}

export async function getTodaySentence() {
    await ensureDailySentences();
    const today = new Date().toISOString().split('T')[0] + "T00:00:00.000Z"

    // Try to find exact match for today
    let sentence = await prisma.dailySentence.findUnique({
        where: {
            date: new Date(today),
        },
    })

    // Fallback: If no sentence for today (e.g. timezone diff), get the FIRST one (Day 1)
    if (!sentence) {
        sentence = await prisma.dailySentence.findFirst({
            orderBy: {
                date: 'asc',
            },
        })
    }

    return sentence
}

export async function getRandomSentence() {
    await ensureDailySentences();

    // Get total count
    const count = await prisma.dailySentence.count();

    if (count === 0) {
        return null;
    }

    // Generate random skip
    const skip = Math.floor(Math.random() * count);

    // Fetch random sentence
    const sentence = await prisma.dailySentence.findFirst({
        skip: skip,
    });

    return sentence;
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

        // Check for existing post by this user for this sentence
        const existingPost = await prisma.post.findFirst({
            where: {
                authorId,
                sentenceId
            }
        });

        let post;
        if (existingPost) {
            // Update existing post
            post = await prisma.post.update({
                where: { id: existingPost.id },
                data: {
                    content,
                    createdAt: new Date() // Update timestamp to show it's fresh
                }
            });
        } else {
            // Create new post
            post = await prisma.post.create({
                data: {
                    content,
                    authorId,
                    sentenceId,
                },
            });
        }

        revalidatePath('/')
        return { success: true, post }
    } catch (error) {
        console.error("Failed to create/update post:", error)
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

export async function getUserPosts(userId: string, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    try {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    authorId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: skip,
                include: {
                    sentence: true,
                    _count: {
                        select: { likes: true, comments: true }
                    }
                }
            }),
            prisma.post.count({
                where: {
                    authorId: userId
                }
            })
        ]);

        return { posts, total };
    } catch (error) {
        console.error("Critical Error in getUserPosts:", error);
        // Return empty result to prevent crashing
        return { posts: [], total: 0 };
    }
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

export async function getParticipantCount(day: number) {
    if (day < 1) return 0;

    // Calculate date the same way as ensureDailySentences
    const date = new Date(`2026-02-${day.toString().padStart(2, '0')}T00:00:00.000Z`);

    try {
        const sentence = await prisma.dailySentence.findUnique({
            where: { date },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });

        return sentence?._count.posts || 0;
    } catch (e) {
        console.error("Failed to get participant count:", e);
        return 0;
    }
}
