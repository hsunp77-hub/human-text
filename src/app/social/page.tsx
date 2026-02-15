'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import { getPosts, getTodaySentence, likePost, unlikePost, createComment } from '@/lib/actions';
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
    // Day 1: "창문을 여니 햇살이 소나기처럼 쏟아졌다."
    0: [
        {
            id: 'day1-post1',
            content: "여름이었다.",
            createdAt: new Date('2026-02-15'),
            authorId: 'user_summer',
            sentence: { content: "창문을 여니 햇살이 소나기처럼 쏟아졌다." },
            _count: { likes: 12, comments: 4 }
        },
        {
            id: 'day1-post2',
            content: "2025년 겨울도 이런 아침이었다",
            createdAt: new Date('2026-02-15'),
            authorId: 'user_winter',
            sentence: { content: "창문을 여니 햇살이 소나기처럼 쏟아졌다." },
            _count: { likes: 8, comments: 2 }
        },
        {
            id: 'day1-post3',
            content: "뒤에서 고양이가 나를 불렀다",
            createdAt: new Date('2026-02-15'),
            authorId: 'user_cat',
            sentence: { content: "창문을 여니 햇살이 소나기처럼 쏟아졌다." },
            _count: { likes: 15, comments: 5 }
        },
        {
            id: 'day1-post4',
            content: "눈을 감고 한참 얼굴을 떠올렸다",
            createdAt: new Date('2026-02-15'),
            authorId: 'user_face',
            sentence: { content: "창문을 여니 햇살이 소나기처럼 쏟아졌다." },
            _count: { likes: 6, comments: 0 }
        },
        {
            id: 'day1-post5',
            content: "그 순간 초인종이 울렸다.",
            createdAt: new Date('2026-02-15'),
            authorId: 'user_bell',
            sentence: { content: "창문을 여니 햇살이 소나기처럼 쏟아졌다." },
            _count: { likes: 20, comments: 8 }
        }
    ],
    // Day 2-10: Empty for now (will show empty state)
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
};


export default function SocialPage() {
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
        return `Writer ${id.substring(0, 4)}`;
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
                            marginBottom: '40px'
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
                                fontFamily: 'serif',
                                letterSpacing: '1px'
                            }}>
                                Day {currentSentenceIndex + 1} of {DAILY_PROMPTS.length}
                            </div>
                        </div>

                        {loading ? (
                            <div className="center-flex-col" style={{ padding: '40px 0', gap: '16px' }}>
                                <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'serif', fontSize: '12px', letterSpacing: '2px' }}>기억을 읽어오는 중...</p>
                            </div>
                        ) : (
                            <>
                                <div id="post-list-top" className="relative w-full px-2 min-h-0" style={{ maxWidth: '432px', margin: '0 auto' }}>
                                    {currentPosts.map((post, index) => {
                                        const globalIndex = indexOfFirstPost + index + 1;
                                        const isLast = index === currentPosts.length - 1;

                                        // Stacking logic from Sentences page
                                        const stickyTop = 0 + (index * 130);

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
                                                    marginBottom: expandedPostId === post.id ? '20px' : (isLast ? '40px' : '-110px'),
                                                    transition: 'all 0.5s ease-in-out',
                                                    border: '1px solid #3F3F46', // Create border similar to sentences
                                                    background: '#18181B' // Zinc-900 like background
                                                }}
                                            >
                                                <div className="index-card-inner">
                                                    {/* Card Header */}
                                                    <div className="index-card-header">
                                                        <div className="index-card-day" style={{ fontSize: '24px' }}>
                                                            Story {String(globalIndex).padStart(2, '0')}
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <div className="index-card-meta">
                                                                {formatUserId(post.authorId)}
                                                            </div>
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
                                                                color: likedPosts.has(post.id) ? '#ef4444' : undefined,
                                                                transition: 'color 0.3s'
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
                                                                        fontFamily: 'var(--font-serif)',
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
                                                                        fontFamily: 'var(--font-serif)',
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
                                                                fontFamily: 'serif',
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
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px 0', fontFamily: 'serif', fontSize: '14px' }}>
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
                    </section>
                </main>

                <Footer pageContext="social" />
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
                        <span className="social-action-icon">♥</span>
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
