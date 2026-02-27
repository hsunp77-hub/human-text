'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { likePost, unlikePost } from '@/lib/actions';
import { DAILY_PROMPTS } from '@/lib/sentences';
import { SENTENCE_POSTS, PostWithRelations, MOCK_USER_DATA } from '@/lib/mockPosts';

function SocialContent() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

    // Get current sentence based on index
    const mainSentence = DAILY_PROMPTS[currentSentenceIndex];

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        setLoading(true);
        const sentencePosts = SENTENCE_POSTS[currentSentenceIndex] || [];
        setPosts(sentencePosts);

        const counts: Record<string, number> = {};
        sentencePosts.forEach(post => {
            counts[post.id] = post._count.likes;
        });
        setLikeCounts(counts);
        setLoading(false);
        setCurrentPage(1);
    }, [currentSentenceIndex]);

    const formatDisplayId = (authorId: string) => {
        const userData = MOCK_USER_DATA[authorId];
        return userData ? userData.name : authorId;
    };

    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const listTop = document.getElementById('post-list-top');
        if (listTop) listTop.scrollIntoView({ behavior: 'smooth' });
    };

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

    const handleLike = async (postId: string) => {
        if (!userId) return;

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
                await unlikePost(postId, userId);
            } else {
                await likePost(postId, userId);
            }
        } catch (error) {
            console.error('Failed to update like:', error);
        }
    };

    const handleCommentClick = (postId: string) => {
        setActiveCommentPostId(activeCommentPostId === postId ? null : postId);
    };

    return (
        <div className="app-container">
            <div className="mobile-view relative flex flex-col w-full h-full min-h-screen overflow-hidden !p-0">
                {/* Fixed Top Section */}
                <div className="sticky top-0 z-40 bg-[var(--bg-color)] px-6 pt-10 pb-4 shadow-sm">
                    <Header title="그날" />

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '48px', marginBottom: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', opacity: 0.4, marginBottom: '20px', width: '100%', textAlign: 'center' }}>Memory Stream</div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', padding: '0 16px', flexWrap: 'nowrap' }}>
                            <button
                                onClick={handlePrevSentence}
                                className="w-10 h-10 transition-all opacity-60"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--text-secondary)' }}
                            >
                                ‹
                            </button>

                            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', color: 'var(--text-primary)', lineHeight: '1.2', fontWeight: 'bold', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px', margin: 0, padding: '0 8px', wordBreak: 'keep-all' }} key={currentSentenceIndex}>
                                "{mainSentence}"
                            </h2>

                            <button
                                onClick={handleNextSentence}
                                className="w-10 h-10 transition-all opacity-60"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--text-secondary)' }}
                            >
                                ›
                            </button>
                        </div>

                        <div className="mt-5 text-[12px] text-[var(--text-secondary)] font-sans tracking-[0.1em] font-medium opacity-60 w-full !text-center">
                            index {String(currentSentenceIndex + 1).padStart(3, '0')} — {posts.length}개의 기록
                        </div>
                    </div>
                </div>

                <main className="w-full flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center py-20 gap-4">
                            <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-ping"></div>
                            <p className="text-[var(--text-muted)] font-sans text-[12px] tracking-[2px]">기억을 읽어오는 중...</p>
                        </div>
                    ) : (
                        <div className="mt-2 text-center">
                            <div className="h-scroll-container">
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
                                        <div key={post.id} className="h-scroll-item">
                                            <Link href={`/user/${post.authorId}`}>
                                                <article className={`postcard-card ${pastelClass}`} style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', justifyContent: 'space-between', padding: '32px', boxShadow: '0 10px 40px rgba(140, 112, 112, 0.08)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.8)', position: 'relative' }}>
                                                    <div className="archive-card-date" style={{ color: 'rgba(0,0,0,0.2)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
                                                        {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
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
                                                                    src={MOCK_USER_DATA[post.authorId]?.image || `https://i.pravatar.cc/150?u=${post.authorId}`}
                                                                    alt={formatDisplayId(post.authorId)}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            <div style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: '600', opacity: 0.6 }}>
                                                                {formatDisplayId(post.authorId)}
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
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    cursor: 'pointer',
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
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    cursor: 'pointer',
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
                                            </Link>
                                        </div>
                                    );
                                })}
                                {posts.length === 0 && (
                                    <div className="w-full text-center text-[var(--text-muted)] py-20 font-sans text-sm italic">
                                        아직 기록된 문장이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="mt-auto pt-10">
                        <Footer pageContext="social" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SocialPage() {
    return (
        <Suspense fallback={
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-sans italic text-sm">로딩 중...</div>
                </div>
            </div>
        }>
            <SocialContent />
        </Suspense>
    );
}

