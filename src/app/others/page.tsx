import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const formatDisplayId = (userId: string) => userId;

export default async function OthersPage() {
    const users = await prisma.user.findMany({
        where: {
            name: {
                startsWith: 'User_'
            }
        },
        include: {
            posts: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    sentence: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        },
        take: 15
    });

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="타인의 문장들" className="!mb-[80px]" />

                <main className="w-full pb-10">
                    <div className="space-y-6">
                        {users.map((user) => {
                            const latestPost = user.posts[0];
                            if (!latestPost) return null;

                            // Clean content by removing "일차 기록" and "(질문:...)" markers
                            const cleanedContent = latestPost.content
                                .replace(/\s*\(질문\s*:.*?\)/, '')
                                .replace(/.*?일차 기록\s*:\s*/, '');

                            return (
                                <Link key={user.id} href={`/user/${user.id}`}>
                                    <article className="archive-card">
                                        <div className="archive-card-date">
                                            {new Date(latestPost.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="archive-card-merged-text">
                                            <span style={{ fontWeight: 600 }}>{latestPost.sentence?.content}</span>
                                            <span> {cleanedContent}</span>
                                        </div>
                                        <div className="archive-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#27272a',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid #3f3f46'
                                                }}>
                                                    <img
                                                        src={`https://i.pravatar.cc/150?u=${user.id}`}
                                                        alt={user.name || 'User'}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div style={{ fontSize: '10px', color: '#71717A', fontFamily: 'serif', letterSpacing: '0.5px' }}>
                                                    {formatDisplayId(user.name || user.id)}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="action-btn">
                                                    <span className="mr-1">♥</span>
                                                    LIKE 0
                                                </button>
                                                <button className="action-btn">
                                                    <span className="mr-1">💬</span>
                                                    COMMENT 0
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                </main>

                <Footer pageContext="others" />
            </div>
        </div>
    );
}

