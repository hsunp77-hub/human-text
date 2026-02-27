'use client';

import { useEffect, useState } from 'react';
import { getOthersUsers } from '@/lib/actions';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import { Suspense } from 'react';

const USERS_PER_PAGE = 5;

interface UserWithPost {
    id: string;
    name: string | null;
    posts: {
        content: string;
        createdAt: Date;
        sentence: {
            content: string;
        } | null;
    }[];
}

function OthersContent() {
    const [users, setUsers] = useState<UserWithPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const formatDisplayId = (userId: string) => userId;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const { users: fetched, total } = await getOthersUsers(page, USERS_PER_PAGE);
                const mapped = (fetched as any[]).map(u => ({
                    ...u,
                    posts: u.posts.map((p: any) => ({
                        ...p,
                        createdAt: new Date(p.createdAt)
                    }))
                }));
                setUsers(mapped);
                setTotalPages(Math.ceil(total / USERS_PER_PAGE));
            } catch (err) {
                console.error('Failed to fetch others users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-sans italic text-sm">불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="타인의 문장들" className="!mb-[80px]" />

                <main className="w-full pb-10">
                    <div className="space-y-8">
                        {users.map((user, index) => {
                            const latestPost = user.posts[0];
                            if (!latestPost) return null;

                            const pastelClasses = ['pastel-mint', 'pastel-blue', 'pastel-peach'];
                            const pastelClass = pastelClasses[index % pastelClasses.length];

                            const cleanedContent = latestPost.content
                                .replace(/\s*\(질문\s*:.*?\)/, '')
                                .replace(/.*?일차 기록\s*:\s*/, '');

                            return (
                                <Link key={user.id} href={`/user/${user.id}`}>
                                    <article className={`pastel-card ${pastelClass}`}>
                                        <div className="archive-card-date !text-[rgba(0,0,0,0.3)] !mb-4">
                                            {latestPost.createdAt.toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="archive-card-merged-text !text-[var(--text-primary)] !mb-6">
                                            <span style={{ fontWeight: 600 }}>{latestPost.sentence?.content}</span>
                                            <span> {cleanedContent}</span>
                                        </div>
                                        <div className="archive-card-footer !border-[rgba(0,0,0,0.05)]">
                                            <div className="card-author-info">
                                                <div className="card-author-avatar !border-[rgba(0,0,0,0.05)]">
                                                    <img
                                                        src={`https://i.pravatar.cc/150?u=${user.id}`}
                                                        alt={user.name || 'User'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="card-author-name !text-[var(--text-secondary)]">
                                                    {formatDisplayId(user.name || user.id)}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="action-btn !bg-white/30 !border-[rgba(0,0,0,0.05)] !text-[var(--text-secondary)]">
                                                    <span className="mr-1">♥</span>
                                                    0
                                                </button>
                                                <button className="action-btn !bg-white/30 !border-[rgba(0,0,0,0.05)] !text-[var(--text-secondary)]">
                                                    <span className="mr-1">💬</span>
                                                    0
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </main>

                <Footer pageContext="others" />
            </div>
        </div>
    );
}

export default function OthersPage() {
    return (
        <Suspense fallback={
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-sans italic text-sm">로딩 중...</div>
                </div>
            </div>
        }>
            <OthersContent />
        </Suspense>
    );
}
