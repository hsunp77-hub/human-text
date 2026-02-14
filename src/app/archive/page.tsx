'use client';

import { useEffect, useState } from 'react';
import { getUserPosts } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface PostWithRelations {
    id: string;
    content: string;
    createdAt: Date;
    sentence: {
        content: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
}

export default function ArchivePage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const POSTS_PER_PAGE = 5;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('human_text_id');
                if (userId) {
                    const { posts: userPosts, total } = await getUserPosts(userId, page, POSTS_PER_PAGE);
                    // Ensure createdAt is converted to Date objects
                    const formattedPosts = (userPosts as any[]).map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }));
                    setPosts(formattedPosts);
                    setTotalPages(Math.ceil(total / POSTS_PER_PAGE));
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-serif italic text-sm">기록을 불러오고 있습니다...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">

                {/* Unified Header */}
                <Header title="나의 기록" />

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    {posts.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center pt-24 text-center">
                            <p className="text-gray-500 italic mb-16 font-serif">아직 남긴 기록이 없으시네요.</p>
                            <Link
                                href="/write"
                                className="premium-btn px-10 py-3"
                            >
                                첫 기록 남기기
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <article key={post.id} className="archive-card">
                                    <div className="archive-card-date">
                                        {post.createdAt.toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="archive-card-sentence">
                                        {post.sentence.content}
                                    </div>
                                    <div className="archive-card-content">
                                        {post.content}
                                    </div>
                                    <div className="archive-card-footer">
                                        <button className="action-btn">
                                            <span className="mr-1">♥</span>
                                            LIKE {post._count.likes}
                                        </button>
                                        <button className="action-btn">
                                            <span className="mr-1">💬</span>
                                            COMMENT {post._count.comments}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`pagination-number ${page === pageNum ? 'active' : ''}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="py-12 flex flex-col items-center gap-6">
                    <div className="footer-nav font-serif">
                        <Link href="/sentences" className="cursor-pointer hover:text-white transition-opacity duration-300 opacity-60 hover:opacity-100">문장의 날짜</Link>
                        <span className="nav-dot opacity-40">•</span>
                        <Link href="/write" className="cursor-pointer hover:text-white transition-opacity duration-300 opacity-60 hover:opacity-100">쓰기</Link>
                        <span className="nav-dot opacity-40">•</span>
                        <Link href="/about" className="cursor-pointer hover:text-white transition-opacity duration-300 opacity-60 hover:opacity-100">소개</Link>
                    </div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#71717A] opacity-40 font-medium">
                        Human Text © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
