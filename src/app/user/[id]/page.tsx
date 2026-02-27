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

    const formatDisplayId = (authorId: string) => {
        const userData = MOCK_USER_DATA[authorId];
        return userData ? userData.name : authorId;
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

                <div className="profile-header !bg-white/50 !border-[rgba(140,125,112,0.1)] !rounded-[28px] !p-8 !mb-10 shadow-sm">
                    <div className="profile-top-row">
                        <div className="profile-avatar-container">
                            <div className="w-full h-full relative bg-white rounded-full overflow-hidden border border-[rgba(140,125,112,0.1)] flex items-center justify-center">
                                <img
                                    src={userInfo.image || `https://i.pravatar.cc/150?u=${userId}`}
                                    alt={userInfo.name}
                                    className="profile-avatar-img"
                                />
                            </div>
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stat-item">
                                <span className="profile-stat-value !text-[var(--text-primary)]">{posts.length > 0 ? (MOCK_USER_DATA[userId] ? getAllMockPostsForUser(userId).length : posts.length) : 0}</span>
                                <span className="profile-stat-label !text-[var(--text-muted)]">posts</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-info">
                        <h2 className="profile-name !text-[var(--text-primary)]">{userInfo.name}</h2>
                        <p className="profile-bio !text-[var(--text-muted)]">
                            {userInfo.bio}
                        </p>
                    </div>
                </div>

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    <div className="space-y-8">
                        {posts.map((post, index) => {
                            const pastelClasses = ['pastel-mint', 'pastel-blue', 'pastel-peach', 'pastel-lilac'];
                            const pastelClass = pastelClasses[index % pastelClasses.length];

                            const cleanPostContent = (content: string, prompt: string) => {
                                let cleaned = content;
                                // Remove the prompt if it's repeated at the start (with or without quotes)
                                const promptVariations = [`"${prompt}"`, `'${prompt}'`, prompt];
                                for (const variant of promptVariations) {
                                    if (cleaned.startsWith(variant)) {
                                        cleaned = cleaned.substring(variant.length).trim();
                                        break;
                                    }
                                }
                                // Remove boilerplate "...에 대한 첫 번째 기록입니다"
                                cleaned = cleaned.replace(/^.*에 대한 첫 [번버]째 기록입니다\.?\s*/, '');
                                return cleaned;
                            };

                            const cleanedContent = cleanPostContent(post.content, post.sentence.content);

                            return (
                                <article
                                    key={post.id}
                                    className={`postcard-card ${pastelClass}`}
                                    style={{
                                        height: '400px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        textAlign: 'left',
                                        justifyContent: 'space-between',
                                        padding: '32px',
                                        boxShadow: '0 10px 40px rgba(140, 112, 112, 0.08)',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255, 255, 255, 0.8)',
                                        position: 'relative',
                                        margin: '0',
                                        width: '100%'
                                    }}
                                >
                                    <div className="archive-card-date" style={{ color: 'rgba(0,0,0,0.2)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </div>

                                    <div style={{ color: 'var(--text-primary)', fontSize: '17px', lineHeight: '1.7', width: '100%', flex: 1, overflow: 'hidden' }}>
                                        <span style={{ fontWeight: 600, wordBreak: 'keep-all' }}>
                                            {post.sentence.content} {cleanedContent}
                                        </span>
                                    </div>

                                    <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                            <div className="card-author-avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(140,125,112,0.1)' }}>
                                                <img
                                                    src={userInfo.image || `https://i.pravatar.cc/150?u=${userId}`}
                                                    alt={userInfo.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', opacity: 0.6 }}>
                                                {userInfo.name}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
                                            <button
                                                className="transition-all hover:scale-110 active:scale-90"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleLike(post.id);
                                                }}
                                                style={{
                                                    background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                                                    color: likedPosts.has(post.id) ? '#ff4d4d' : 'rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <span style={{ fontSize: '15px' }}>{likedPosts.has(post.id) ? '♥' : '♡'}</span>
                                                <span style={{ fontSize: '12px', fontWeight: '600', opacity: 1 }}>{likeCounts[post.id] ?? post._count.likes}</span>
                                            </button>
                                            <button
                                                className="transition-all hover:scale-110 active:scale-90"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCommentClick(post.id);
                                                }}
                                                style={{
                                                    background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                                                    color: 'rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                <span style={{ fontSize: '12px', fontWeight: '600', opacity: 1 }}>{post._count.comments}</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
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
