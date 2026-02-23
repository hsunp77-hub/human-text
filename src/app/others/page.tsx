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
                    <div className="space-y-6">
                        {users.map((user) => {
                            const latestPost = user.posts[0];
                            if (!latestPost) return null;

                            const cleanedContent = latestPost.content
                                .replace(/\s*\(질문\s*:.*?\)/, '')
                                .replace(/.*?일차 기록\s*:\s*/, '');

                            return (
                                <Link key={user.id} href={`/user/${user.id}`}>
                                    <article className="archive-card">
                                        <div className="archive-card-date">
                                            {latestPost.createdAt.toLocaleDateString('ko-KR', {
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
