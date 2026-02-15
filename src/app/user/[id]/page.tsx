'use client';

import { useEffect, useState, use } from 'react';
import { getUserPosts, likePost, unlikePost, createComment } from '@/lib/actions';
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

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const POSTS_PER_PAGE = 5;

    const formatUserId = (id: string) => {
        if (!id) return 'Unknown';
        return `Writer ${id.substring(0, 4)}`;
    }

    useEffect(() => {
        const storedLikes = localStorage.getItem('likedPosts');
        if (storedLikes) {
            setLikedPosts(new Set(JSON.parse(storedLikes)));
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { posts: userPosts, total } = await getUserPosts(userId, page, POSTS_PER_PAGE);

                const formattedPosts = (userPosts as any[]).map(post => ({
                    ...post,
                    createdAt: new Date(post.createdAt)
                }));

                setPosts(formattedPosts);
                setTotalPages(Math.ceil(total / POSTS_PER_PAGE));

                // Initialize like counts
                const counts: Record<string, number> = {};
                formattedPosts.forEach(post => {
                    counts[post.id] = post._count.likes;
                });
                setLikeCounts(prev => ({ ...prev, ...counts }));

            } catch (error) {
                console.error("Failed to fetch user posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchPosts();
    }, [userId, page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLike = async (postId: string) => {
        // Simple client-side anonymous ID for liking
        let myId = localStorage.getItem('anonymousUserId');
        if (!myId) {
            myId = `anon_${Date.now()}`;
            localStorage.setItem('anonymousUserId', myId);
        }

        const isLiked = likedPosts.has(postId);
        const newLikedPosts = new Set(likedPosts);

        if (isLiked) {
            newLikedPosts.delete(postId);
            setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) - 1 }));
        } else {
            newLikedPosts.add(postId);
            setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        }

        setLikedPosts(newLikedPosts);
        localStorage.setItem('likedPosts', JSON.stringify(Array.from(newLikedPosts)));

        try {
            if (isLiked) {
                await unlikePost(postId, myId);
            } else {
                await likePost(postId, myId);
            }
        } catch (error) {
            console.error('Failed to update like:', error);
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-serif italic text-sm">로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="타인의 문장" className="!mb-[40px]" />

                {/* User Profile Info */}
                <div className="flex flex-col items-center mb-10 w-full">
                    <div className="w-20 h-20 rounded-full bg-[#27272a] border-2 border-[#3f3f46] flex items-center justify-center mb-4 overflow-hidden">
                        <span className="text-2xl text-[#71717A] font-serif uppercase">{userId.substring(0, 1)}</span>
                    </div>
                    <h2 className="text-xl font-serif text-white mb-2">{formatUserId(userId)}</h2>
                    <div className="h-[1px] w-12 bg-[#3f3f46] mb-2"></div>
                </div>

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
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
                                    <button
                                        className="action-btn"
                                        onClick={() => handleLike(post.id)}
                                        style={{ color: likedPosts.has(post.id) ? '#ff4d4d' : undefined }}
                                    >
                                        <span className="mr-1">♥</span>
                                        LIKE {likeCounts[post.id] ?? post._count.likes}
                                    </button>
                                    <button className="action-btn cursor-default">
                                        <span className="mr-1">💬</span>
                                        COMMENT {post._count.comments}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </main>

                <Footer pageContext="social" />
            </div>
        </div>
    );
}
