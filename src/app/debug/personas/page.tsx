import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default async function PersonasPage() {
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
        }
    });

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="Mock Personas" className="!mb-[40px]" />

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    <div className="space-y-6">
                        {users.map(user => {
                            const latestPost = user.posts[0];
                            return (
                                <Link key={user.id} href={`/debug/personas/${user.name}`}>
                                    <article className="archive-card">
                                        <div className="archive-card-date">
                                            {latestPost ? new Date(latestPost.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'No records yet'}
                                        </div>
                                        <div className="archive-card-merged-text">
                                            {latestPost ? (
                                                <>
                                                    <span style={{ fontWeight: 600 }}>{latestPost.sentence?.content}</span>
                                                    <span> {latestPost.content.replace(/\s*\(질문\s*:.*?\)/, '').replace(/.*?일차 기록\s*:\s*/, '')}</span>
                                                </>
                                            ) : (
                                                <span className="text-zinc-500 italic">No posts available for this user.</span>
                                            )}
                                        </div>
                                        <div className="archive-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {/* User ID with profile image on the left */}
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
                                                    {user.name}
                                                </div>
                                            </div>

                                            {/* Action buttons on the right */}
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
