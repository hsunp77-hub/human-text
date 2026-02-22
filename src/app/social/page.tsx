'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { getPosts, likePost, unlikePost, createComment } from '@/lib/actions';
import { DAILY_PROMPTS } from '@/lib/sentences';

interface PostWithRelations {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    sentence: {
        content: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
}

// Mock data linked to specific sentences
// Each post has a sentenceIndex (0-9) corresponding to DAILY_PROMPTS array
const SENTENCE_POSTS: Record<number, PostWithRelations[]> = {
    0: [
        {
            id: 'day1-p1',
            content: "계절이 바뀌는 냄새는 늘 그리운 사람을 먼저 데려온다.",
            createdAt: new Date('2026-02-15'),
            authorId: '봄의_기록',
            sentence: { content: DAILY_PROMPTS[0] },
            _count: { likes: 12, comments: 2 }
        }
    ],
    1: [
        {
            id: 'day2-p1',
            content: "지칠 줄 모르고 뛰던 우리들의 그림자도 그곳에 멈춰있을까.",
            createdAt: new Date('2026-02-15'),
            authorId: '여름소년',
            sentence: { content: DAILY_PROMPTS[1] },
            _count: { likes: 8, comments: 1 }
        }
    ],
    2: [
        {
            id: 'day3-p1',
            content: "텅 빈 골목길, 바람만이 나를 스쳐 지나갔다.",
            createdAt: new Date('2026-02-15'),
            authorId: '가을산책',
            sentence: { content: DAILY_PROMPTS[2] },
            _count: { likes: 15, comments: 3 }
        }
    ],
    3: [
        {
            id: 'day4-p1',
            content: "입김 속에 섞인 한숨이 하얗게 흩어지는 밤이었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '겨울아이',
            sentence: { content: DAILY_PROMPTS[3] },
            _count: { likes: 21, comments: 5 }
        }
    ],
    4: [
        {
            id: 'day5-p1',
            content: "깨어있는 것이 죄처럼 느껴지는 새벽, 나는 펜을 들었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '새벽작가',
            sentence: { content: DAILY_PROMPTS[4] },
            _count: { likes: 19, comments: 4 }
        }
    ],
    5: [
        {
            id: 'day6-p1',
            content: "평범함 속에 숨어있던 균열이 그날 비로소 모습을 드러냈다.",
            createdAt: new Date('2026-02-15'),
            authorId: '일상의_단면',
            sentence: { content: DAILY_PROMPTS[5] },
            _count: { likes: 32, comments: 8 }
        }
    ],
    6: [
        {
            id: 'day7-p1',
            content: "아무 말도 하지 않았지만, 그 눈빛만으로 충분한 대화였다.",
            createdAt: new Date('2026-02-15'),
            authorId: '무언의_고백',
            sentence: { content: DAILY_PROMPTS[6] },
            _count: { likes: 25, comments: 6 }
        }
    ],
    7: [
        {
            id: 'day8-p1',
            content: "수화기 너머의 침묵이 세상에서 가장 무거운 말이 되었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '마지막_통화',
            sentence: { content: DAILY_PROMPTS[7] },
            _count: { likes: 45, comments: 12 }
        }
    ],
    8: [
        {
            id: 'day9-p1',
            content: "참아왔던 눈물은 노을보다 더 짙게 마음을 적셨다.",
            createdAt: new Date('2026-02-15'),
            authorId: '노을지기',
            sentence: { content: DAILY_PROMPTS[8] },
            _count: { likes: 38, comments: 7 }
        }
    ],
    9: [
        {
            id: 'day10-p1',
            content: "어둠은 때로 가장 선명한 글씨체가 된다.",
            createdAt: new Date('2026-02-15'),
            authorId: '밤의_사유',
            sentence: { content: DAILY_PROMPTS[9] },
            _count: { likes: 52, comments: 15 }
        }
    ],
    10: [
        {
            id: 'day11-p1',
            content: "아픔은 성장의 한 조각임을, 그 어린 날의 나는 이미 알고 있었을까.",
            createdAt: new Date('2026-02-15'),
            authorId: '기억상자',
            sentence: { content: DAILY_PROMPTS[10] },
            _count: { likes: 24, comments: 4 }
        }
    ],
    11: [
        {
            id: 'day12-p1',
            content: "사라진 노래 소리 대신, 이제는 기억 속의 바람 소리만 남았다.",
            createdAt: new Date('2026-02-15'),
            authorId: '여름의_끝',
            sentence: { content: DAILY_PROMPTS[11] },
            _count: { likes: 16, comments: 3 }
        }
    ],
    12: [
        {
            id: 'day13-p1',
            content: "정처 없던 마음도 어느덧 세월의 흐름을 따라 여기까지 왔다.",
            createdAt: new Date('2026-02-15'),
            authorId: '흐르는_시간',
            sentence: { content: DAILY_PROMPTS[12] },
            _count: { likes: 29, comments: 5 }
        }
    ],
    13: [
        {
            id: 'day14-p1',
            content: "책임이라는 옷은 생각보다 얇고, 겨울 새벽은 너무나 길었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '서툰_어른',
            sentence: { content: DAILY_PROMPTS[13] },
            _count: { likes: 42, comments: 9 }
        }
    ],
    14: [
        {
            id: 'day15-p1',
            content: "이름표 하나로 정의될 수 없는 나의 진심은 어디로 가야 하는 걸까.",
            createdAt: new Date('2026-02-15'),
            authorId: '바다의_목소리',
            sentence: { content: DAILY_PROMPTS[14] },
            _count: { likes: 31, comments: 6 }
        }
    ],
    15: [
        {
            id: 'day16-p1',
            content: "홀가분해진 어깨 위에 내려앉은 것은, 온전한 나의 삶이었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '새로운_시작',
            sentence: { content: DAILY_PROMPTS[15] },
            _count: { likes: 58, comments: 11 }
        }
    ],
    16: [
        {
            id: 'day17-p1',
            content: "누군가의 엄마가 아닌, 나로 불리고 싶었던 순간이 있었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '이름의_의미',
            sentence: { content: DAILY_PROMPTS[16] },
            _count: { likes: 47, comments: 14 }
        }
    ],
    17: [
        {
            id: 'day18-p1',
            content: "급하게 달려오느라 놓쳤던 풍경들이 이제야 눈에 들어오기 시작한다.",
            createdAt: new Date('2026-02-15'),
            authorId: '걸음을_늦추다',
            sentence: { content: DAILY_PROMPTS[17] },
            _count: { likes: 35, comments: 8 }
        }
    ],
    18: [
        {
            id: 'day19-p1',
            content: "먼지 쌓인 꿈을 털어내자, 비로소 나만의 계절이 다시 시작되었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '꿈을_찾아서',
            sentence: { content: DAILY_PROMPTS[18] },
            _count: { likes: 64, comments: 16 }
        }
    ],
    19: [
        {
            id: 'day20-p1',
            content: "가진 것을 놓을 때마다, 마음의 곳간은 오히려 더 넉넉해졌다.",
            createdAt: new Date('2026-02-15'),
            authorId: '비움의_시간',
            sentence: { content: DAILY_PROMPTS[19] },
            _count: { likes: 51, comments: 10 }
        }
    ],
    20: [
        {
            id: 'day21-p1',
            content: "고통 없는 삶은 없지만, 그 모든 순간이 나를 빚어낸 시간이었음을.",
            createdAt: new Date('2026-02-15'),
            authorId: '폭풍우_뒤에',
            sentence: { content: DAILY_PROMPTS[20] },
            _count: { likes: 72, comments: 19 }
        }
    ],
    21: [
        {
            id: 'day22-p1',
            content: "끝은 늘 새로운 시작의 다른 이름일 뿐이다.",
            createdAt: new Date('2026-02-15'),
            authorId: '마지막_장',
            sentence: { content: DAILY_PROMPTS[21] },
            _count: { likes: 43, comments: 9 }
        }
    ],
    22: [
        {
            id: 'day23-p1',
            content: "사랑은 때로 온 우주를 한 사람의 손끝에 가둬두기도 한다.",
            createdAt: new Date('2026-02-15'),
            authorId: '심장소리',
            sentence: { content: DAILY_PROMPTS[22] },
            _count: { likes: 89, comments: 24 }
        }
    ],
    23: [
        {
            id: 'day24-p1',
            content: "남겨진 문장들은 마침표를 찍지 못한 채 여전히 허공을 맴돈다.",
            createdAt: new Date('2026-02-15'),
            authorId: '이별의_잔상',
            sentence: { content: DAILY_PROMPTS[23] },
            _count: { likes: 55, comments: 13 }
        }
    ],
    24: [
        {
            id: 'day25-p1',
            content: "첫 단추를 끼우는 손끝이 미세하게 떨리고 있었다.",
            createdAt: new Date('2026-02-15'),
            authorId: '새벽의_출발',
            sentence: { content: DAILY_PROMPTS[24] },
            _count: { likes: 39, comments: 7 }
        }
    ],
    25: [
        {
            id: 'day26-p1',
            content: "함께 걷는 이 길 끝에, 같은 풍경을 보며 웃을 수 있기를.",
            createdAt: new Date('2026-02-15'),
            authorId: '영원의_약속',
            sentence: { content: DAILY_PROMPTS[25] },
            _count: { likes: 94, comments: 28 }
        }
    ],
    26: [
        {
            id: 'day27-p1',
            content: "눈을 감는 순간, 세상은 비로소 나만의 색채로 가득 찼다.",
            createdAt: new Date('2026-02-15'),
            authorId: '마지막_호흡',
            sentence: { content: DAILY_PROMPTS[26] },
            _count: { likes: 110, comments: 35 }
        }
    ]
};


export default function SocialPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

    // Get current sentence based on index
    const mainSentence = DAILY_PROMPTS[currentSentenceIndex];

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Initialize user ID and liked posts from localStorage
    useEffect(() => {
        let storedUserId = localStorage.getItem('anonymousUserId');
        if (!storedUserId) {
            storedUserId = `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            localStorage.setItem('anonymousUserId', storedUserId);
        }
        setUserId(storedUserId);

        const storedLikes = localStorage.getItem('likedPosts');
        if (storedLikes) {
            setLikedPosts(new Set(JSON.parse(storedLikes)));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts - using Mock for now
                await getPosts(40); // Fetched but ignored for now to prioritize mock display

                // Get posts for current sentence
                const sentencePosts = SENTENCE_POSTS[currentSentenceIndex] || [];
                setPosts(sentencePosts);

                // Initialize like counts from mock data
                const counts: Record<string, number> = {};
                sentencePosts.forEach(post => {
                    counts[post.id] = post._count.likes;
                });
                setLikeCounts(counts);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Even on error, set posts for current sentence
                const sentencePosts = SENTENCE_POSTS[currentSentenceIndex] || [];
                setPosts(sentencePosts);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentSentenceIndex]); // Re-fetch when sentence changes

    const formatUserId = (id: string) => {
        if (!id) return 'Unknown';
        return id;
    }

    // Pagination Logic
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const listTop = document.getElementById('post-list-top');
        if (listTop) listTop.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCardClick = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    const handleProfileNavigation = (authorId: string) => {
        router.push(`/user/${authorId}`);
    };

    // Sentence navigation handlers
    const handlePrevSentence = () => {
        setCurrentSentenceIndex(prev =>
            prev === 0 ? DAILY_PROMPTS.length - 1 : prev - 1
        );
    };

    const handleNextSentence = () => {
        setCurrentSentenceIndex(prev =>
            (prev + 1) % DAILY_PROMPTS.length
        );
    };

    // Like/Unlike handler
    const handleLike = async (postId: string) => {
        if (!userId) return;

        const isLiked = likedPosts.has(postId);
        const newLikedPosts = new Set(likedPosts);

        // Optimistic update
        if (isLiked) {
            newLikedPosts.delete(postId);
            setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) - 1 }));
        } else {
            newLikedPosts.add(postId);
            setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        }

        setLikedPosts(newLikedPosts);
        localStorage.setItem('likedPosts', JSON.stringify(Array.from(newLikedPosts)));

        // Server update (in background)
        try {
            if (isLiked) {
                await unlikePost(postId, userId);
            } else {
                await likePost(postId, userId);
            }
        } catch (error) {
            console.error('Failed to update like:', error);
            // Revert on error
            setLikedPosts(likedPosts);
            if (isLiked) {
                setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
            } else {
                setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) - 1 }));
            }
        }
    };

    // Comment expansion handler
    const handleCommentClick = (postId: string) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    // Comment submission handler
    const handleCommentSubmit = async (postId: string) => {
        const content = commentInputs[postId]?.trim();
        if (!content || !userId) return;

        try {
            const result = await createComment(postId, userId, content);
            if (result.success) {
                // Clear input
                setCommentInputs(prev => ({ ...prev, [postId]: '' }));
                // You could also update local state to show the new comment immediately
                alert('댓글이 등록되었습니다!');
            }
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    return (
        <div className="app-container" style={{ backgroundColor: '#121212' }}>
            <div className="mobile-view relative flex flex-col w-full h-full min-h-screen overflow-hidden !bg-[#121212] !p-0">

                {/* Main Content Area - Header moved inside so it scrolls */}
                <main className="w-full flex-1 overflow-y-auto px-6 pt-[40px] pb-10 no-scrollbar" style={{ paddingTop: '40px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px', width: '100%', overflowY: 'auto' }}>

                    {/* scrollable Header */}
                    <div style={{ marginBottom: '40px', paddingRight: '4px', opacity: 0.9 }}>
                        <Header title="그날" />
                    </div>

                    {/* SECTION 1: Main Sentence & User Posts */}
                    <section style={{ marginBottom: '20px' }}>
                        {/* Sentence Navigation Container */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '80px'
                        }}>
                            {/* Arrow buttons + Sentence */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '24px',
                                width: '100%',
                                maxWidth: '500px'
                            }}>
                                {/* Left Arrow */}
                                <button
                                    onClick={handlePrevSentence}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                    }}
                                >
                                    ‹
                                </button>

                                {/* Sentence Display (typing animation removed for reliability) */}
                                <div className="typing-header" style={{ flex: 1, minWidth: 0 }}>
                                    <h2 className="typing-text">
                                        "{mainSentence}"
                                    </h2>
                                </div>

                                {/* Right Arrow */}
                                <button
                                    onClick={handleNextSentence}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                    }}
                                >
                                    ›
                                </button>
                            </div>

                            {/* Sentence Counter */}
                            <div style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontFamily: 'var(--font-sans)',
                                letterSpacing: '1px'
                            }}>
                                index {String(currentSentenceIndex + 1).padStart(3, '0')} of {DAILY_PROMPTS.length}
                            </div>
                        </div>

                        {loading ? (
                            <div className="center-flex-col" style={{ padding: '40px 0', gap: '16px' }}>
                                <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '2px' }}>기억을 읽어오는 중...</p>
                            </div>
                        ) : (
                            <>
                                <div id="post-list-top" className="relative w-full px-2 min-h-0" style={{ maxWidth: '432px', margin: '0 auto' }}>
                                    {currentPosts.map((post, index) => {
                                        const globalIndex = indexOfFirstPost + index + 1;
                                        const isLast = index === currentPosts.length - 1;

                                        // Stacking logic from Sentences page
                                        const stickyTop = 20 + (index * 180);

                                        return (
                                            <div
                                                key={post.id}
                                                className="index-card block w-full group"
                                                style={{
                                                    position: 'sticky',
                                                    top: `${stickyTop}px`,
                                                    minHeight: '240px',
                                                    height: expandedPostId === post.id ? 'auto' : '240px',
                                                    overflow: 'hidden',
                                                    zIndex: expandedPostId === post.id ? 999 : index + 1,
                                                    marginBottom: expandedPostId === post.id ? '24px' : (isLast ? '40px' : '-60px'),
                                                    transition: 'all 0.5s ease-in-out',
                                                    border: '1px solid #3F3F46', // Create border similar to sentences
                                                    background: '#18181B' // Zinc-900 like background
                                                }}
                                            >
                                                <div className="index-card-inner">
                                                    {/* Card Header */}
                                                    <div className="index-card-header">
                                                        <div className="index-card-day" style={{ fontSize: '24px' }}>
                                                            Sentence {String(globalIndex).padStart(2, '0')}
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <Link
                                                                href={`/user/${post.authorId}`}
                                                                className="index-card-meta hover:underline cursor-pointer"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {formatUserId(post.authorId)}
                                                            </Link>
                                                            <div className="index-card-meta mt-1">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="index-card-content flex-1 transition-all duration-300 text-[#E4E4E7] line-clamp-4" style={{ whiteSpace: 'pre-wrap', fontStyle: 'normal' }}>
                                                        {post.content}
                                                    </div>

                                                    {/* Footer Actions - Restored Button Style */}
                                                    <div className="social-actions" style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                        <button
                                                            className="social-action-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLike(post.id);
                                                            }}
                                                            style={{
                                                                color: likedPosts.has(post.id) ? '#ff4d4d' : undefined,
                                                                transition: 'all 0.3s'
                                                            }}
                                                        >
                                                            <span className="social-action-icon" style={{
                                                                transform: likedPosts.has(post.id) ? 'scale(1.1)' : 'scale(1)',
                                                                transition: 'transform 0.3s'
                                                            }}>♥</span>
                                                            <span>LIKE {likeCounts[post.id] ?? post._count.likes}</span>
                                                        </button>
                                                        <button
                                                            className="social-action-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCommentClick(post.id);
                                                            }}
                                                        >
                                                            <span className="social-action-icon">💬</span>
                                                            <span>COMMENT {post._count.comments}</span>
                                                        </button>
                                                    </div>

                                                    {/* Inline Comment Section */}
                                                    {expandedPostId === post.id && (
                                                        <div style={{
                                                            marginTop: '16px',
                                                            paddingTop: '16px',
                                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                                            animation: 'slideDown 0.3s ease-out'
                                                        }}>
                                                            {/* Comment Input */}
                                                            <div style={{ marginBottom: '12px' }}>
                                                                <textarea
                                                                    value={commentInputs[post.id] || ''}
                                                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                    placeholder="이 글에 대한 생각을 남겨보세요..."
                                                                    style={{
                                                                        width: '100%',
                                                                        minHeight: '100px',
                                                                        padding: '16px',
                                                                        background: 'rgba(0, 0, 0, 0.2)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        borderRadius: '12px',
                                                                        color: '#E4E4E7',
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
                                                                <button
                                                                    onClick={() => handleCommentSubmit(post.id)}
                                                                    style={{
                                                                        marginTop: '12px',
                                                                        padding: '8px 20px',
                                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                                        borderRadius: '99px',
                                                                        color: 'rgba(255, 255, 255, 0.9)',
                                                                        fontFamily: 'var(--font-sans)',
                                                                        fontSize: '12px',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s',
                                                                        letterSpacing: '1px',
                                                                        float: 'right'
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
                                                                    댓글 등록
                                                                </button>
                                                                <div className="clearfix" style={{ clear: 'both' }}></div>
                                                            </div>

                                                            {/* Existing Comments Placeholder */}
                                                            <div style={{
                                                                fontSize: '11px',
                                                                color: 'rgba(255, 255, 255, 0.3)',
                                                                fontFamily: 'var(--font-sans)',
                                                                fontStyle: 'italic',
                                                                textAlign: 'center',
                                                                padding: '8px 0'
                                                            }}>
                                                                댓글 {post._count.comments}개
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {posts.length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px 0', fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
                                            아직 기록된 문장이 없습니다.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {/* Pagination Controls */}
                                <div style={{ marginTop: '40px' }}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </>
                        )}
                        <div className="mt-10">
                            <Footer pageContext="social" />
                        </div>
                    </section>
                </main>
            </div>
        </div >
    );
}

// Typing Effect Component
function TypingText({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        setDisplayedText(""); // Reset

        const intervalId = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 50); // Typing speed

        return () => clearInterval(intervalId);
    }, [text, started]);

    return (
        <h2 className={className}>
            {displayedText}
            <span className="typing-cursor">|</span>
        </h2>
    );
}

// Post Item Component
function PostItem({ post, index, formatUserId }: { post: PostWithRelations, index: number, formatUserId: (id: string) => string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`social-card ${isExpanded ? 'expanded' : ''}`}
            style={{ width: '100%' }}
        >
            {!isExpanded && (
                <div className="social-date">
                    {formattedDate}
                </div>
            )}

            <div className={`social-content ${!isExpanded ? 'line-clamp-2' : ''}`}>
                {post.content}
            </div>

            <div className="social-footer">
                <div className="social-id-group">
                    <div className="social-avatar">
                        {formatUserId(post.authorId).charAt(7) || 'W'}
                    </div>
                    <span className="social-id-text">
                        {formatUserId(post.authorId)}
                    </span>
                </div>

                <div className="social-actions">
                    <button
                        className="social-action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <span className="social-action-icon" style={{ color: '#ff4d4d' }}>♥</span>
                        <span>LIKE {post._count.likes}</span>
                    </button>
                    <button
                        className="social-action-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <span className="social-action-icon">💬</span>
                        <span>COMMENT {post._count.comments}</span>
                    </button>
                </div>
            </div>

            {!isExpanded && (
                <div className="expand-icon">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            )}
        </div>
    )
}
