'use client';

import { useEffect, useState } from 'react';
import { getUserPosts } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ArchivePage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userId = localStorage.getItem('human_text_id');
                if (userId) {
                    const userPosts = await getUserPosts(userId);
                    // Ensure createdAt is converted to Date objects if needed
                    const formattedPosts = (userPosts as any[]).map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }));
                    setPosts(formattedPosts);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-serif italic">기록을 불러오고 있습니다...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view px-6" style={{ justifyContent: 'flex-start' }}>

                {/* Header matching mockup */}
                <header className="w-full flex justify-between items-center mt-12 mb-10">
                    <h1 className="text-2xl font-medium text-white font-serif">나의 기록</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-serif"
                    >
                        ← 홈으로
                    </button>
                </header>

                <main className="w-full flex-1 overflow-y-auto pb-10">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center pt-20 text-center">
                            <p className="text-gray-500 font-serif italic mb-8">아직 남긴 기록이 없으시네요.</p>
                            <Link
                                href="/write"
                                className="premium-btn px-10 py-3"
                            >
                                첫 기록 남기기
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <article key={post.id} className="archive-card">
                                    <div className="archive-card-date">
                                        {post.createdAt.toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="archive-card-sentence">
                                        Q. {post.sentence.content}
                                    </div>
                                    <div className="archive-card-content">
                                        {post.content}
                                    </div>
                                    <div className="archive-card-footer">
                                        LIKE {post._count.likes}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="py-10 text-center opacity-30">
                    <p className="text-[10px] tracking-widest uppercase text-gray-500">
                        Human Text © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
