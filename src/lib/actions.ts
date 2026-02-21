'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { COURSE_CONTENT, determineGroupCode, AgeRange, Gender } from './course-content'

// Seed all sentences for all groups
export async function ensureDailySentences() {
    const groups = Object.values(COURSE_CONTENT);

    for (const group of groups) {
        for (let i = 0; i < group.sentences.length; i++) {
            const dayIndex = i + 1;
            const content = group.sentences[i];

            // Upsert based on dayIndex + groupCode
            await prisma.dailySentence.upsert({
                where: {
                    dayIndex_groupCode: {
                        dayIndex,
                        groupCode: group.code
                    }
                },
                update: { content },
                create: {
                    dayIndex,
                    groupCode: group.code,
                    content
                }
            });
        }
    }
}

// Get a specific sentence for a user's group and day
export async function getSentenceByDay(day: number, groupCode: string = 'G1') {
    if (day < 1 || day > 21) return null;

    let sentence = await prisma.dailySentence.findUnique({
        where: {
            dayIndex_groupCode: {
                dayIndex: day,
                groupCode
            }
        }
    });

    if (!sentence) {
        // Fallback: try to ensure sentences exist
        await ensureDailySentences();
        sentence = await prisma.dailySentence.findUnique({
            where: {
                dayIndex_groupCode: {
                    dayIndex: day,
                    groupCode
                }
            }
        });
    }

    return sentence;
}

// Get the sentence for the user's current progress
export async function getCurrentSentenceForUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { posts: { select: { sentenceId: true } } } // Optimization: just get sentence IDs or count
    });

    if (!user) return null;

    // Determine current day based on posts
    // Logic: Day N is unlocked if Day N-1 is done.
    // So current day = (Number of unique days posted) + 1.
    // We need to count how many distinct dayIndices the user has posted for.
    // But since we can't easily join to get dayIndex in a simple count, we might need a better query or just count posts if we enforce 1 post per day.
    // Let's assume 1 post per day is the goal.
    // Actually, user might have multiple posts for same day? 
    // Let's count *completed* sentences.

    // We need to find which sentences the user has posted to.
    const userPosts = await prisma.post.findMany({
        where: { authorId: userId },
        select: { sentence: { select: { dayIndex: true } } }
    });

    const completedDays = new Set(userPosts.map(p => p.sentence.dayIndex));
    const nextDay = completedDays.size + 1;

    if (nextDay > 21) return null; // Course completed

    const groupCode = user.sentenceGroup || 'G1';
    return getSentenceByDay(nextDay, groupCode);
}

export async function createPost(formData: FormData) {
    const content = formData.get('content') as string
    const authorId = formData.get('authorId') as string
    const sentenceId = formData.get('sentenceId') as string

    if (!content || content.length > 500) {
        return { error: "Content must be between 1 and 500 characters." }
    }

    try {
        await prisma.user.upsert({
            where: { id: authorId },
            update: {},
            create: { id: authorId },
        })

        const existingPost = await prisma.post.findFirst({
            where: {
                authorId,
                sentenceId
            }
        });

        let post;
        if (existingPost) {
            post = await prisma.post.update({
                where: { id: existingPost.id },
                data: {
                    content,
                    createdAt: new Date()
                }
            });
        } else {
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
            author: true, // Include author to show name/avatar
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
                where: { authorId: userId },
                orderBy: { createdAt: 'desc' },
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
                where: { authorId: userId }
            })
        ]);
        return { posts, total };
    } catch (error) {
        console.error("Critical Error in getUserPosts:", error);
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
            data: { postId, userId }
        })
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        return { error: "Already liked" }
    }
}

export async function unlikePost(postId: string, userId: string) {
    try {
        await prisma.like.deleteMany({
            where: { postId, userId }
        })
        revalidatePath('/')
        return { success: true }
    } catch (e) {
        return { error: "Failed to unlike" }
    }
}

export async function createComment(postId: string, userId: string, content: string) {
    try {
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId },
        })
        const comment = await prisma.comment.create({
            data: { postId, userId, content }
        })
        revalidatePath('/')
        return { success: true, comment }
    } catch (e) {
        console.error("Failed to create comment:", e)
        return { error: "Failed to create comment" }
    }
}

export async function getParticipantCount(day: number) {
    // This needs to be group aware or total? 
    // "Participant count" usually means total people who wrote on Day X, regardless of group?
    // Let's assume global Day X count.

    // We can count posts where sentence.dayIndex == day
    try {
        const count = await prisma.post.count({
            where: {
                sentence: {
                    dayIndex: day
                }
            }
        });
        return count;
    } catch (e) {
        console.error("Failed to get participant count:", e);
        return 0;
    }
}

export async function getUserProfile(userId: string) {
    try {
        return await prisma.user.findUnique({
            where: { id: userId }
        });
    } catch (e) {
        console.error("Failed to get user profile:", e);
        return null;
    }
}

export async function updateUserProfile(userId: string, data: {
    name?: string,
    bio?: string,
    image?: string,
    birthday?: Date,
    gender?: string,
    residence?: string,
    pin?: string,
    isSignupCompleted?: boolean,
    ageRange?: string,
    sentenceGroup?: string
}) {
    try {
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: data,
            create: {
                id: userId,
                ...data
            }
        });
        revalidatePath('/');
        return { success: true, user };
    } catch (e) {
        console.error("Failed to update user profile:", e);
        return { error: "Update failed" };
    }
}

export async function saveOnboardingData(userId: string, age: AgeRange, gender: Gender) {
    const groupCode = determineGroupCode(age, gender);
    return await updateUserProfile(userId, {
        ageRange: age,
        gender: gender,
        sentenceGroup: groupCode
    });
}

export async function isUsernameUnique(name: string, excludeUserId?: string) {
    if (!name.trim()) return { success: true, isUnique: false, error: "이름을 입력해주세요." };
    try {
        const user = await prisma.user.findFirst({
            where: {
                name,
                NOT: excludeUserId ? { id: excludeUserId } : undefined
            }
        });
        return { success: true, isUnique: !user };
    } catch (e) {
        return { success: false, error: "Check failed" };
    }
}
