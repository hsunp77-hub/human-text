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
        image: '/user_summer_profile.png' // Updated extension to png
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

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = use(params);
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
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
                    <div className="w-24 h-24 rounded-full bg-[#27272a] border-2 border-[#3f3f46] flex items-center justify-center mb-4 overflow-hidden relative">
                        {userInfo.image ? (
                            <div className="w-full h-full relative bg-[#1c1c1e]">
                                <div className="absolute inset-0 flex items-center justify-center text-[#3f3f46]">
                                    <span className="text-3xl font-serif">{userId.substring(0, 1).toUpperCase()}</span>
                                </div>
                                <img
                                    src={userInfo.image}
                                    alt={userInfo.name}
                                    className="w-full h-full object-cover relative z-10"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        ) : (
                            <span className="text-3xl text-[#71717A] font-serif uppercase">{userId.substring(0, 1)}</span>
                        )}
                    </div>
                    <h2 className="text-xl font-serif text-white mb-2">{formatDisplayId(userId)}</h2>
                    <p className="text-sm text-gray-400 font-serif italic text-center max-w-[80%]" style={{ lineHeight: '1.6' }}>
                        {userInfo.bio}
                    </p>
                    <div className="h-[1px] w-12 bg-[#3f3f46] mt-4 mb-2"></div>
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
