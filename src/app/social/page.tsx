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
        <div className="app-container" style={{ backgroundColor: '#121212' }}>
            <div className="mobile-view relative flex flex-col w-full h-full min-h-screen overflow-hidden !bg-[#121212] !p-0">
                <main className="w-full flex-1 overflow-y-auto px-6 pt-[40px] pb-10 no-scrollbar">
                    <div style={{ marginBottom: '40px', opacity: 0.9 }}>
                        <Header title="그날" />
                    </div>

                    <section style={{ marginBottom: '20px' }}>
                        <div className="flex flex-col items-center mb-36">
                            <div className="social-header-row">
                                <button
                                    onClick={handlePrevSentence}
                                    className="social-nav-btn"
                                >
                                    ‹
                                </button>
                                <div className="flex-1 text-center">
                                    <h2 className="font-sans text-[22px] text-white/95 leading-relaxed word-keep-all px-4 font-bold">
                                        "{mainSentence}"
                                    </h2>
                                </div>
                                <button
                                    onClick={handleNextSentence}
                                    className="social-nav-btn"
                                >
                                    ›
                                </button>
                            </div>
                            <div className="social-index-label">
                                index {String(currentSentenceIndex + 1).padStart(3, '0')} of {DAILY_PROMPTS.length}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center py-10 gap-4">
                                <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                                <p className="text-white/30 font-sans text-[12px] tracking-[2px]">기억을 읽어오는 중...</p>
                            </div>
                        ) : (
                            <>
                                <div id="post-list-top" className="space-y-6 max-w-[432px] mx-auto">
                                    {currentPosts.map((post) => (
                                        <Link key={post.id} href={`/user/${post.authorId}`}>
                                            <article className="archive-card">
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
                                                    <div className="card-author-info">
                                                        <div className="card-author-avatar">
                                                            <img
                                                                src={MOCK_USER_DATA[post.authorId]?.image || `https://i.pravatar.cc/150?u=${post.authorId}`}
                                                                alt={formatDisplayId(post.authorId)}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="card-author-name">
                                                            {formatDisplayId(post.authorId)}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className="action-btn"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleLike(post.id);
                                                            }}
                                                            style={{ color: likedPosts.has(post.id) ? '#ff4d4d' : undefined }}
                                                        >
                                                            <span className="mr-1">♥</span>
                                                            LIKE {likeCounts[post.id] ?? post._count.likes}
                                                        </button>
                                                        <button
                                                            className="action-btn"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCommentClick(post.id);
                                                            }}
                                                        >
                                                            <span className="mr-1">💬</span>
                                                            COMMENT {post._count.comments}
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                    {posts.length === 0 && (
                                        <div className="text-center text-white/20 py-10 font-sans text-sm">
                                            아직 기록된 문장이 없습니다.
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-10">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        <div className="mt-10">
                            <Footer pageContext="social" />
                        </div>
                    </section>
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

