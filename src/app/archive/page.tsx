'use client';

import { useEffect, useState } from 'react';
import { getUserPosts } from '@/lib/actions';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

    const searchParams = useSearchParams();
    const forceEmpty = searchParams.get('empty') === 'true';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (forceEmpty) {
                    setPosts([]);
                    setLoading(false);
                    return;
                }
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
    }, [page, forceEmpty]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading && posts.length === 0 && !forceEmpty) {
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
                <Header title="내 문장들" />

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    {(posts.length === 0 && !loading) || forceEmpty ? (
                        <div className="flex flex-col items-center justify-center text-center w-full h-full min-h-[60vh]">
                            {/* Text Area with large top margin to center it visually but push it down */}
                            <div className="mt-[150px] mb-[100px]">
                                <p className="text-[#71717A] font-serif text-lg tracking-widest">
                                    아직 남긴 기록이 없으세요.
                                </p>
                            </div>

                            {/* Button with large margin from text */}
                            <div className="mb-[150px]">
                                <Link
                                    href="/write"
                                    className="premium-btn px-12 py-4 text-lg"
                                >
                                    첫 기록 남기기
                                </Link>
                            </div>
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
                        <div className="pagination-container">
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

                <Footer pageContext="archive" />
            </div>
        </div>
    );
}
