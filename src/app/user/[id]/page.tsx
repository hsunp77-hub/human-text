'use client';

import { useEffect, useState, use } from 'react';
import { getUserPosts, likePost, unlikePost, createComment } from '@/lib/actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import Image from 'next/image';

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

// Mock User Data Repository
const MOCK_USER_DATA: Record<string, { name: string; bio: string; image?: string }> = {
    'user_summer': {
        name: 'user_summer',
        bio: '여름의 조각들을 문장으로 담아내는 사람입니다. 소소한 일상과 계절의 변화를 기록하며 살아갑니다.',
        image: '/user_summer_profile.png'
    },
    'user_spring': {
        name: 'user_spring',
        bio: '새로운 시작과 희망의 계절, 봄을 사랑하는 작가입니다. 피어나는 꽃처럼 매일 새로운 이야기를 만들어갑니다.',
        image: '/user_spring_profile.png'
    },
    'user_autumn': {
        name: 'user_autumn',
        bio: '가을의 쓸쓸함 속에서 아름다움을 찾는 사람입니다. 낙엽처럼 조용히 내려앉는 생각들을 글로 남깁니다.',
        image: '/user_autumn_profile.png'
    },
    'user_winter': {
        name: 'user_winter',
        bio: '고요한 겨울의 순간들을 담아냅니다. 차가운 공기 속에서 더욱 선명해지는 감정들을 기록합니다.',
        image: '/user_winter_profile.png'
    }
};

// Mock Posts for user_summer
const MOCK_SUMMER_POSTS: PostWithRelations[] = [
    {
        id: 'summer-1',
        content: '매일 아침 창가에 머무는 햇살이 너무 투명해서, 그대로 멈춰 서고 싶은 기분이 들어요.',
        createdAt: new Date('2026-02-15'),
        sentence: { content: '그 순간 초인종이 울렸다.' },
        _count: { likes: 12, comments: 2 }
    },
    {
        id: 'summer-2',
        content: '오후의 나른함 속에서 발견한 낡은 책 한 권이 오늘의 위로가 되었습니다.',
        createdAt: new Date('2026-02-14'),
        sentence: { content: '뒤에서 고양이가 나를 불렀다' },
        _count: { likes: 8, comments: 1 }
    },
    {
        id: 'summer-3',
        content: '빗소리가 들리는 저녁, 따뜻한 차 한 잔과 함께 고요를 즐기고 있어요.',
        createdAt: new Date('2026-02-13'),
        sentence: { content: '눈을 감고 한참 얼굴을 떠올렸다' },
        _count: { likes: 15, comments: 4 }
    }
];

// Mock Posts for user_spring
const MOCK_SPRING_POSTS: PostWithRelations[] = [
    {
        id: 'spring-1',
        content: '벚꽃이 흐드러지게 피어난 길을 걷다가 문득 새로운 시작이 떠올랐어요.',
        createdAt: new Date('2026-02-15'),
        sentence: { content: '그 순간 초인종이 울렸다.' },
        _count: { likes: 10, comments: 3 }
    },
    {
        id: 'spring-2',
        content: '봄바람에 실려온 꽃향기가 지난 겨울의 기억을 지워주는 것 같았습니다.',
        createdAt: new Date('2026-02-14'),
        sentence: { content: '뒤에서 고양이가 나를 불렀다' },
        _count: { likes: 7, comments: 2 }
    },
    {
        id: 'spring-3',
        content: '새싹이 돋아나는 걸 보며, 나도 다시 시작할 수 있다는 용기를 얻었어요.',
        createdAt: new Date('2026-02-13'),
        sentence: { content: '눈을 감고 한참 얼굴을 떠올렸다' },
        _count: { likes: 13, comments: 5 }
    }
];

// Mock Posts for user_autumn
const MOCK_AUTUMN_POSTS: PostWithRelations[] = [
    {
        id: 'autumn-1',
        content: '단풍이 물든 길을 걸으며 삶의 변화를 받아들이는 법을 배웁니다.',
        createdAt: new Date('2026-02-15'),
        sentence: { content: '그 순간 초인종이 울렸다.' },
        _count: { likes: 14, comments: 4 }
    },
    {
        id: 'autumn-2',
        content: '낙엽이 바스락거리는 소리가 마음을 차분하게 만들어주네요.',
        createdAt: new Date('2026-02-14'),
        sentence: { content: '뒤에서 고양이가 나를 불렀다' },
        _count: { likes: 9, comments: 2 }
    },
    {
        id: 'autumn-3',
        content: '쌀쌀한 저녁 공기 속에서 따뜻한 추억들이 더 선명하게 떠오릅니다.',
        createdAt: new Date('2026-02-13'),
        sentence: { content: '눈을 감고 한참 얼굴을 떠올렸다' },
        _count: { likes: 11, comments: 3 }
    }
];

// Mock Posts for user_winter
const MOCK_WINTER_POSTS: PostWithRelations[] = [
    {
        id: 'winter-1',
        content: '첫눈이 내리는 고요한 아침, 세상이 새하얗게 덮여가는 모습을 바라봅니다.',
        createdAt: new Date('2026-02-15'),
        sentence: { content: '그 순간 초인종이 울렸다.' },
        _count: { likes: 16, comments: 5 }
    },
    {
        id: 'winter-2',
        content: '차가운 공기를 들이마시면 마음이 더욱 또렷해지는 것을 느껴요.',
        createdAt: new Date('2026-02-14'),
        sentence: { content: '뒤에서 고양이가 나를 불렀다' },
        _count: { likes: 12, comments: 3 }
    },
    {
        id: 'winter-3',
        content: '눈 내린 거리를 혼자 걸으며 고독이 주는 평화를 만끽합니다.',
        createdAt: new Date('2026-02-13'),
        sentence: { content: '눈을 감고 한참 얼굴을 떠올렸다' },
        _count: { likes: 10, comments: 2 }
    }
];

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
    const POSTS_PER_PAGE = 5;

    const userInfo = MOCK_USER_DATA[userId] || { name: userId, bio: '작가의 소개가 등록되지 않았습니다.' };

    const formatDisplayId = (id: string) => {
        if (MOCK_USER_DATA[id]) return MOCK_USER_DATA[id].name;
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

                let userPosts: any[] = [];
                let total = 0;

                if (userId === 'user_summer') {
                    // Use mock data for summer user
                    userPosts = MOCK_SUMMER_POSTS;
                    total = MOCK_SUMMER_POSTS.length;
                } else if (userId === 'user_spring') {
                    // Use mock data for spring user
                    userPosts = MOCK_SPRING_POSTS;
                    total = MOCK_SPRING_POSTS.length;
                } else if (userId === 'user_autumn') {
                    // Use mock data for autumn user
                    userPosts = MOCK_AUTUMN_POSTS;
                    total = MOCK_AUTUMN_POSTS.length;
                } else if (userId === 'user_winter') {
                    // Use mock data for winter user
                    userPosts = MOCK_WINTER_POSTS;
                    total = MOCK_WINTER_POSTS.length;
                } else {
                    // Fetch real data for other users
                    const result = await getUserPosts(userId, page, POSTS_PER_PAGE);
                    userPosts = result.posts;
                    total = result.total;
                }

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
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
            setCommentContent("");
        } else {
            setActiveCommentPostId(postId);
            setCommentContent("");
        }
    };

    const [mockComments, setMockComments] = useState<Record<string, { id: string, userId: string, content: string, createdAt: Date }[]>>({});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const startEditingComment = (commentId: string, content: string) => {
        setEditingCommentId(commentId);
        setEditContent(content);
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        // In a real app, call API here. For now, update local state
        setMockComments(prev => ({
            ...prev,
            [postId]: prev[postId].filter(c => c.id !== commentId)
        }));

        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    _count: {
                        ...p._count,
                        comments: Math.max(0, p._count.comments - 1)
                    }
                };
            }
            return p;
        }));
    };

    const saveEditComment = async (postId: string, commentId: string) => {
        if (!editContent.trim()) return;

        // In a real app, call API here. For now, update local state
        setMockComments(prev => ({
            ...prev,
            [postId]: prev[postId].map(c =>
                c.id === commentId ? { ...c, content: editContent } : c
            )
        }));

        setEditingCommentId(null);
        setEditContent("");
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
            // Check if it's a mock post (user_summer) or real post
            if (userId === 'user_summer') {
                // For mock posts, simulate storage in local state
                const newComment = {
                    id: `comment_${Date.now()}`,
                    userId: myId,
                    content: commentContent,
                    createdAt: new Date()
                };

                // Update mock comments state
                setMockComments(prev => ({
                    ...prev,
                    [postId]: [newComment, ...(prev[postId] || [])]
                }));

                // Update post comment count optimistically
                setPosts(prevPosts => prevPosts.map(p => {
                    if (p.id === postId) {
                        return {
                            ...p,
                            _count: {
                                ...p._count,
                                comments: p._count.comments + 1
                            }
                        };
                    }
                    return p;
                }));

                console.log(`Mock comment submitted for ${postId}: ${commentContent}`);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // No alert needed for smoother UX, just update UI
            } else {
                const result = await createComment(postId, myId, commentContent);
                if (result.success && result.comment) {
                    // Update mock comments state (for immediate display)
                    setMockComments(prev => ({
                        ...prev,
                        [postId]: [result.comment, ...(prev[postId] || [])]
                    }));

                    // Update local comment count
                    setPosts(prevPosts => prevPosts.map(p => {
                        if (p.id === postId) {
                            return {
                                ...p,
                                _count: {
                                    ...p._count,
                                    comments: p._count.comments + 1
                                }
                            };
                        }
                        return p;
                    }));
                } else {
                    alert("댓글 등록에 실패했습니다.");
                }
            }

            // Reset state
            setCommentContent("");
            // Do NOT close the comment section, so user can see their new comment
            // setActiveCommentPostId(null); 
        } catch (error) {
            console.error("Comment submission failed:", error);
            alert("오류가 발생했습니다.");
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

                {/* User Profile Info - Instagram Style */}
                <div className="profile-header">
                    <div className="profile-top-row">
                        {/* Avatar */}
                        <div className="profile-avatar-container">
                            <div className="w-full h-full relative bg-[#1c1c1e] rounded-full overflow-hidden border border-[#3f3f46] flex items-center justify-center">
                                <img
                                    src={userInfo.image || `https://i.pravatar.cc/150?u=${userId}`}
                                    alt={userInfo.name}
                                    className="profile-avatar-img"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        if (target.nextElementSibling) {
                                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                        }
                                    }}
                                />
                                {/* Fallback */}
                                <div className="absolute inset-0 items-center justify-center text-[#3f3f46] hidden">
                                    <div className="profile-avatar-fallback">
                                        {userId.substring(0, 1).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="profile-stats">
                            <div className="profile-stat-item">
                                <span className="profile-stat-value">{posts.length > 0 ? posts.length : (userId === 'user_summer' ? 3 : 0)}</span>
                                <span className="profile-stat-label">posts</span>
                            </div>
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="profile-info">
                        <h2 className="profile-name">{formatDisplayId(userId)}</h2>
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
                                    {post.createdAt.toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="archive-card-merged-text">
                                    <span style={{ fontWeight: 600 }}>{post.sentence.content}</span>
                                    <span> {post.content.replace(/\s*\(질문\s*:.*?\)/, '').replace(/.*?일차 기록\s*:\s*/, '')}</span>
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
                                        style={{
                                            color: activeCommentPostId === post.id ? '#D4D4D8' : undefined,
                                            borderColor: activeCommentPostId === post.id ? 'rgba(255,255,255,0.2)' : undefined
                                        }}
                                    >
                                        <span className="mr-1">💬</span>
                                        COMMENT {post._count.comments}
                                    </button>
                                </div>

                                {activeCommentPostId === post.id && (
                                    <div style={{
                                        marginTop: '16px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                        animation: 'slideDown 0.3s ease-out'
                                    }}>
                                        {/* Existing Comments List */}
                                        {mockComments[post.id] && mockComments[post.id].length > 0 && (
                                            <div className="mb-4 space-y-3">
                                                {mockComments[post.id].map((comment) => (
                                                    <div key={comment.id} className="text-sm bg-[#18181b] p-3 rounded-lg border border-[#27272a]">
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', width: '100%' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#71717a', fontSize: '10px', fontFamily: 'var(--font-sans)' }}>
                                                                <span className="font-medium">
                                                                    {comment.userId === localStorage.getItem('anonymousUserId') ? 'Me' : 'Guest'}
                                                                </span>
                                                                <span className="opacity-80">
                                                                    {comment.createdAt.toLocaleDateString([], { month: 'numeric', day: 'numeric' })} {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            {comment.userId === localStorage.getItem('anonymousUserId') && (
                                                                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                                                                    <button
                                                                        onClick={() => startEditingComment(comment.id, comment.content)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                            borderRadius: '99px',
                                                                            color: 'rgba(113, 113, 122, 0.8)', // zinc-500
                                                                            fontFamily: 'var(--font-sans)',
                                                                            fontSize: '10px',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                                            e.currentTarget.style.color = 'rgba(161, 161, 170, 0.9)'; // zinc-400
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                            e.currentTarget.style.color = 'rgba(113, 113, 122, 0.8)';
                                                                        }}
                                                                    >
                                                                        수정
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                            borderRadius: '99px',
                                                                            color: 'rgba(113, 113, 122, 0.8)', // zinc-500
                                                                            fontFamily: 'var(--font-sans)',
                                                                            fontSize: '10px',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                                            e.currentTarget.style.color = '#f87171'; // red-400
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                            e.currentTarget.style.color = 'rgba(113, 113, 122, 0.8)';
                                                                        }}
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {editingCommentId === comment.id ? (
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <textarea
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)}
                                                                    style={{
                                                                        width: '100%',
                                                                        minHeight: '60px',
                                                                        padding: '12px',
                                                                        background: 'rgba(0, 0, 0, 0.2)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: '12px',
                                                                        color: '#d4d4d8', // zinc-300
                                                                        fontFamily: 'var(--font-sans)',
                                                                        fontSize: '14px',
                                                                        resize: 'none',
                                                                        outline: 'none',
                                                                        lineHeight: '1.6'
                                                                    }}
                                                                    onFocus={(e) => {
                                                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                                    }}
                                                                    rows={2}
                                                                />
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                                                                    <button
                                                                        onClick={() => saveEditComment(post.id, comment.id)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                            borderRadius: '99px',
                                                                            color: 'rgba(113, 113, 122, 0.8)', // zinc-500
                                                                            fontFamily: 'var(--font-sans)',
                                                                            fontSize: '10px',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            letterSpacing: '1px'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                            e.currentTarget.style.color = 'rgba(113, 113, 122, 0.8)';
                                                                        }}
                                                                    >
                                                                        저장
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingCommentId(null)}
                                                                        style={{
                                                                            padding: '4px 10px',
                                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                            borderRadius: '99px',
                                                                            color: 'rgba(113, 113, 122, 0.8)', // zinc-500
                                                                            fontFamily: 'var(--font-sans)',
                                                                            fontSize: '10px',
                                                                            cursor: 'pointer',
                                                                            transition: 'all 0.3s',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                                            e.currentTarget.style.color = 'rgba(161, 161, 170, 0.9)'; // zinc-400
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                                            e.currentTarget.style.color = 'rgba(113, 113, 122, 0.8)';
                                                                        }}
                                                                    >
                                                                        취소
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="profile-bio pl-1">
                                                                {comment.content}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Comment Input */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <textarea
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder="이 글에 대한 생각을 남겨보세요..."
                                                autoFocus
                                                style={{
                                                    width: '100%',
                                                    minHeight: '60px',
                                                    padding: '12px',
                                                    background: 'rgba(0, 0, 0, 0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    color: '#d4d4d8', // zinc-300
                                                    fontFamily: 'var(--font-sans)',
                                                    fontSize: '14px',
                                                    resize: 'none',
                                                    outline: 'none',
                                                    lineHeight: '1.6'
                                                }}
                                                onFocus={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                }}
                                                onBlur={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '12px', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleCommentSubmit(post.id)}
                                                    disabled={submitting || !commentContent.trim()}
                                                    style={{
                                                        padding: '6px 16px',
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        borderRadius: '99px',
                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                        fontFamily: 'var(--font-sans)',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        letterSpacing: '1px',
                                                        opacity: (submitting || !commentContent.trim()) ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                                    }}
                                                >
                                                    {submitting ? '등록 중...' : '댓글 등록'}
                                                </button>
                                                <button
                                                    onClick={() => setActiveCommentPostId(null)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '99px',
                                                        color: 'rgba(113, 113, 122, 0.8)', // zinc-500
                                                        fontFamily: 'var(--font-sans)',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                        e.currentTarget.style.color = 'rgba(161, 161, 170, 0.9)'; // zinc-400
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                        e.currentTarget.style.color = 'rgba(113, 113, 122, 0.8)';
                                                    }}
                                                >
                                                    접기
                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                                                        <path d="M18 15l-6-6-6 6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Existing Comments Placeholder/Count */}
                                        <div style={{
                                            fontSize: '11px',
                                            color: 'rgba(113, 113, 122, 0.5)', // zinc-500 with opacity
                                            fontFamily: 'serif',
                                            fontStyle: 'italic',
                                            textAlign: 'center',
                                            padding: '8px 0'
                                        }}>
                                            댓글 {post._count.comments}개
                                        </div>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    {posts.length > POSTS_PER_PAGE && (
                        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </main>

                <Footer pageContext="social" />
            </div>
        </div>
    );
}
