'use client';

import { useEffect, useState } from 'react';
import { getUserPosts } from '@/lib/actions';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';

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


function ArchiveContent() {
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

                // 1. Fetch Local Posts (Client-side fallback)
                let localPosts: PostWithRelations[] = [];
                if (typeof window !== 'undefined') {
                    try {
                        const saved = localStorage.getItem('human_text_posts');
                        if (saved) {
                            localPosts = JSON.parse(saved).map((p: any) => ({
                                ...p,
                                createdAt: new Date(p.createdAt)
                            }));
                        }
                    } catch (e) {
                        console.error("Failed to parse local posts", e);
                    }
                }

                // 2. Fetch Server Posts
                let serverPosts: PostWithRelations[] = [];
                if (typeof window !== 'undefined') {
                    const userId = localStorage.getItem('human_text_id');
                    if (userId) {
                        try {
                            const { posts: userPosts, total } = await getUserPosts(userId, page, POSTS_PER_PAGE);
                            serverPosts = (userPosts as any[]).map(post => ({
                                ...post,
                                createdAt: new Date(post.createdAt)
                            }));
                            setTotalPages(Math.ceil((total || localPosts.length) / POSTS_PER_PAGE));
                        } catch (err) {
                            console.error("Server fetch failed, using local only", err);
                        }
                    }
                }

                // 3. Merge: Prefer server, but valid local posts that aren't in server (e.g. slight delay) should be shown?
                // For simplicity and fallback: If server fails (empty), use local. 
                // Creating a Map to deduplicate by ID if we mix them
                const allPostsMap = new Map<string, PostWithRelations>();

                // Add local posts first
                localPosts.forEach(p => allPostsMap.set(p.id, p));

                // Add/Overwrite with server posts (source of truth) - UNLESS server is empty/failed
                if (serverPosts.length > 0) {
                    serverPosts.forEach(p => allPostsMap.set(p.id, p));
                }

                const mergedPosts = Array.from(allPostsMap.values()).sort((a, b) =>
                    b.createdAt.getTime() - a.createdAt.getTime()
                );

                setPosts(mergedPosts);

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
                <Header title="내 문장들" className="!mb-[80px]" />

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    {(posts.length === 0 && !loading) || forceEmpty ? (
                        <div className="archive-container flex flex-col items-center justify-center w-full min-h-full">
                            {/* Empty State Text */}
                            <p className="empty-message text-gray-500 font-light text-center text-lg" style={{ fontFamily: '"Gungsuh", "GungSeo", "Batang", serif' }}>
                                아직 남긴 기록이 없으세요.
                            </p>

                            {/* Button */}
                            <Link
                                href="/write"
                                className="premium-btn first-record-button text-center"
                            >
                                첫 기록 남기기
                            </Link>

                            {/* Additional spacing not needed as container has padding-bottom */}
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
                                    <div className="archive-card-merged-text">
                                        <span style={{ fontWeight: 600 }}>{post.sentence.content}</span>
                                        <span> {post.content}</span>
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
                    {/* Pagination Controls */}
                    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </main>

                <Footer pageContext="archive" />
            </div>
        </div>
    );
}

import { Suspense } from 'react';

export default function ArchivePage() {
    return (
        <Suspense fallback={
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-serif italic text-sm">로딩 중...</div>
                </div>
            </div>
        }>
            <ArchiveContent />
        </Suspense>
    );
}
