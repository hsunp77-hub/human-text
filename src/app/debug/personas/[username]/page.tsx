import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default async function PersonaDetailPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { name: decodeURIComponent(username) }
    });

    if (!user) {
        return notFound();
    }

    const posts = await prisma.post.findMany({
        where: { authorId: user.id },
        include: {
            sentence: true,
            _count: {
                select: { likes: true }
            }
        },
        orderBy: {
            sentence: {
                dayIndex: 'asc'
            }
        }
    });

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="사용자 프로필" className="!mb-[40px]" />

                {/* Profile Header - Instagram Style */}
                <div className="profile-header">
                    <div className="profile-top-row">
                        {/* Avatar */}
                        <div className="profile-avatar-container">
                            <div className="profile-avatar-fallback" style={{ overflow: 'hidden' }}>
                                <img
                                    src={`https://i.pravatar.cc/150?u=${user.id}`}
                                    alt={user.name || 'User'}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="profile-stats">
                            <div className="profile-stat-item">
                                <span className="profile-stat-value">{posts.length}</span>
                                <span className="profile-stat-label">posts</span>
                            </div>
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="profile-info">
                        <h2 className="profile-name">{user.name}</h2>
                        <div className="profile-bio space-y-1">
                            <p className="text-zinc-400">
                                {user.ageRange} · {user.gender}
                            </p>
                            <p className="text-zinc-500">
                                Group: <span className="text-zinc-300">{user.sentenceGroup}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar space-y-6">
                    {posts.map((post) => (
                        <article key={post.id} className="archive-card">
                            <div className="archive-card-date">
                                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="archive-card-merged-text">
                                <span style={{ fontWeight: 600 }}>{post.sentence?.content}</span>
                                <span> {post.content.replace(/\s*\(질문\s*:.*?\)/, '').replace(/.*?일차 기록\s*:\s*/, '')}</span>
                            </div>
                            <div className="archive-card-footer">
                                <button className="action-btn">
                                    <span className="mr-1">♥</span>
                                    LIKE {post._count.likes || 0}
                                </button>
                                <button className="action-btn">
                                    <span className="mr-1">💬</span>
                                    COMMENT 0
                                </button>
                            </div>
                        </article>
                    ))}

                    {posts.length === 0 && (
                        <div className="text-center py-20 text-gray-500 font-serif">
                            아직 작성된 글이 없습니다.
                        </div>
                    )}
                </div>

                <Footer pageContext="others" />
            </div>
        </div>
    );
}
