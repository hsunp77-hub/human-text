'use client';

import { useEffect, useState, use } from 'react';
import { getUserPosts, likePost, unlikePost, createComment, getUserProfile } from '@/lib/actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import { MOCK_USER_DATA, getAllMockPostsForUser, PostWithRelations } from '@/lib/mockPosts';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState<{ name: string; bio: string; image?: string }>({
        name: userId,
        bio: '작가의 소개가 등록되지 않았습니다.'
    });
    const POSTS_PER_PAGE = 5;

    useEffect(() => {
        const storedLikes = localStorage.getItem('likedPosts');
        if (storedLikes) {
            setLikedPosts(new Set(JSON.parse(storedLikes)));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Check for mock user data first
                const mockUser = MOCK_USER_DATA[userId];
                if (mockUser) {
                    setUserInfo(mockUser);
                    const allMockPosts = getAllMockPostsForUser(userId);
                    const startIndex = (page - 1) * POSTS_PER_PAGE;
                    const paginatedPosts = allMockPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

                    setPosts(paginatedPosts);
                    setTotalPages(Math.ceil(allMockPosts.length / POSTS_PER_PAGE));

                    const counts: Record<string, number> = {};
                    paginatedPosts.forEach(post => {
                        counts[post.id] = post._count.likes;
                    });
                    setLikeCounts(prev => ({ ...prev, ...counts }));
                } else {
                    // Real user logic
                    const profile = await getUserProfile(userId);
                    if (profile) {
                        setUserInfo({
                            name: profile.name || userId,
                            bio: profile.bio || '작가의 소개가 등록되지 않았습니다.',
                            image: profile.image || undefined
                        });
                    }

                    const result = await getUserPosts(userId, page, POSTS_PER_PAGE);
                    const formattedPosts = (result.posts as any[]).map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }));

                    setPosts(formattedPosts);
                    setTotalPages(Math.ceil(result.total / POSTS_PER_PAGE));

                    const counts: Record<string, number> = {};
                    formattedPosts.forEach(post => {
                        counts[post.id] = post._count.likes;
                    });
                    setLikeCounts(prev => ({ ...prev, ...counts }));
                }

            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchData();
    }, [userId, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLike = async (postId: string) => {
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

    const handleCommentClick = (postId: string) => {
        setActiveCommentPostId(activeCommentPostId === postId ? null : postId);
    };

    const handleCommentSubmit = async (postId: string) => {
        if (!commentContent.trim()) return;

        let myId = localStorage.getItem('anonymousUserId');
        if (!myId) {
            myId = `anon_${Date.now()}`;
            localStorage.setItem('anonymousUserId', myId);
        }

        setSubmitting(true);
        try {
            const result = await createComment(postId, myId, commentContent);
            if (result.success) {
                setCommentContent("");
                alert("댓글이 등록되었습니다!");
                // Refresh logic or optimistic update could go here
            }
        } catch (error) {
            console.error("Comment submission failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-sans italic text-sm">로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="타인의 문장" className="!mb-[40px]" />

                <div className="profile-header">
                    <div className="profile-top-row">
                        <div className="profile-avatar-container">
                            <div className="w-full h-full relative bg-[#1c1c1e] rounded-full overflow-hidden border border-[#3f3f46] flex items-center justify-center">
                                <img
                                    src={userInfo.image || `https://i.pravatar.cc/150?u=${userId}`}
                                    alt={userInfo.name}
                                    className="profile-avatar-img"
                                />
                            </div>
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stat-item">
                                <span className="profile-stat-value">{posts.length > 0 ? (MOCK_USER_DATA[userId] ? getAllMockPostsForUser(userId).length : posts.length) : 0}</span>
                                <span className="profile-stat-label">posts</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-info">
                        <h2 className="profile-name">{userInfo.name}</h2>
                        <p className="profile-bio">
                            {userInfo.bio}
                        </p>
                    </div>
                </div>

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    <div className="space-y-6">
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
                                    <button
                                        className="action-btn"
                                        onClick={() => handleCommentClick(post.id)}
                                    >
                                        <span className="mr-1">💬</span>
                                        COMMENT {post._count.comments}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </main>
                <Footer pageContext="others" />
            </div>
        </div>
    );
}
