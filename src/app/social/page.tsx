'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPosts, getTodaySentence } from '@/lib/actions';
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

// User-provided mock data for the second section (5 items)
const MOCK_TEMPLATE: PostWithRelations[] = [
    {
        id: 'mock-1',
        content: "여름이었다.",
        createdAt: new Date('2026-02-15'),
        authorId: 'user_summer',
        sentence: { content: "Topic 2" },
        _count: { likes: 12, comments: 4 }
    },
    {
        id: 'mock-2',
        content: "2025년 겨울도 이런 아침이었다",
        createdAt: new Date('2026-02-15'),
        authorId: 'user_winter',
        sentence: { content: "Topic 2" },
        _count: { likes: 8, comments: 2 }
    },
    {
        id: 'mock-3',
        content: "뒤에서 고양이가 나를 불렀다",
        createdAt: new Date('2026-02-15'),
        authorId: 'user_cat',
        sentence: { content: "Topic 2" },
        _count: { likes: 15, comments: 5 }
    },
    {
        id: 'mock-4',
        content: "눈을 감고 한참 얼굴을 떠올렸다",
        createdAt: new Date('2026-02-15'),
        authorId: 'user_face',
        sentence: { content: "Topic 2" },
        _count: { likes: 6, comments: 0 }
    },
    {
        id: 'mock-5',
        content: "그 순간 초인종이 울렸다.",
        createdAt: new Date('2026-02-15'),
        authorId: 'user_bell',
        sentence: { content: "Topic 2" },
        _count: { likes: 20, comments: 8 }
    }
];

// Duplicate to create 3 pages for demonstration (15 items total)
const FULL_MOCK_DATA = [
    ...MOCK_TEMPLATE.map(p => ({ ...p, id: p.id + '-p1' })),
    ...MOCK_TEMPLATE.map(p => ({ ...p, id: p.id + '-p2' })),
    ...MOCK_TEMPLATE.map(p => ({ ...p, id: p.id + '-p3' }))
];

export default function SocialPage() {
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    // Default to the first sentence in the list (Day 1)
    const [mainSentence, setMainSentence] = useState<string>(DAILY_PROMPTS[0]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts and today's sentence in parallel
                // Just fetching sentence context, using Mock for posts
                const [, sentenceRes] = await Promise.all([
                    getPosts(40), // Fetched but ignored for now to prioritize mock display
                    getTodaySentence()
                ]);

                // FORCE SET MOCK DATA
                setPosts(FULL_MOCK_DATA);

                if (sentenceRes) {
                    setMainSentence(sentenceRes.content);
                } else {
                    // Fallback to Day 1 if DB fetch fails
                    setMainSentence(DAILY_PROMPTS[0]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Even on error, set mock data
                setPosts(FULL_MOCK_DATA);
                setMainSentence(DAILY_PROMPTS[0]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                        <div className="typing-header">
                            <TypingText
                                text={`"${mainSentence}"`}
                                className="typing-text"
                            />
                        </div>

                        {loading ? (
                            <div className="center-flex-col" style={{ padding: '40px 0', gap: '16px' }}>
                                <div style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'serif', fontSize: '12px', letterSpacing: '2px' }}>기억을 읽어오는 중...</p>
                            </div>
                        ) : (
                            <>
                                <div id="post-list-top" className="center-flex-col" style={{ gap: '16px', maxWidth: '576px', margin: '0 auto' }}>
                                    {currentPosts.map((post, index) => (
                                        <PostItem key={post.id} post={post} index={index} formatUserId={formatUserId} />
                                    ))}
                                    {posts.length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px 0', fontFamily: 'serif', fontSize: '14px' }}>
                                            아직 기록된 문장이 없습니다.
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination-container" style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: currentPage === pageNum ? 'white' : 'transparent',
                                                    color: currentPage === pageNum ? 'black' : '#71717A',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    fontFamily: 'var(--font-serif)',
                                                    fontWeight: currentPage === pageNum ? 600 : 400,
                                                    cursor: 'pointer',
                                                    border: 'none'
                                                }}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </main>

                <Footer pageContext="social" />
            </div>
        </div>
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
