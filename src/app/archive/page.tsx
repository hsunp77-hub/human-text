'use client';

import { useEffect, useState } from 'react';
import { getUserPosts } from '@/lib/actions';
import Link from 'next/link';

// Type definition for the post with included relations
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
    const [posts, setPosts] = useState<PostWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const userId = localStorage.getItem('human_text_id');
            if (userId) {
                const userPosts = await getUserPosts(userId);
                setPosts(userPosts);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="app-container">
                <div className="mobile-view flex items-center justify-center">
                    <div className="text-[#71717A] animate-pulse font-medium">기록을 불러오는 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="mobile-view px-8 items-center">
                <header className="w-full flex justify-between items-center mt-12 mb-16">
                    <h1 className="text-3xl font-bold tracking-tighter" style={{ color: 'var(--text-primary)' }}>나의 기록</h1>
                    <Link href="/" className="text-sm font-semibold transition-all hover:text-white" style={{ color: 'var(--accent-color)' }}>
                        ← 홈
                    </Link>
                </header>

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                        <p className="text-lg font-medium mb-8" style={{ color: 'var(--text-secondary)' }}>아직 남긴 기록이 없습니다.</p>
                        <Link
                            href="/"
                            className="bg-white text-black px-10 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105"
                        >
                            기록 시작하기
                        </Link>
                    </div>
                ) : (
                    <div className="w-full space-y-8 flex-1">
                        {posts.map((post) => (
                            <article key={post.id} className="glass-card p-8 transition-all hover:bg-white/10 group">
                                <div className="text-xs font-bold mb-4 uppercase tracking-[0.2em]" style={{ color: 'var(--accent-color)' }}>
                                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="text-sm font-medium mb-6 italic opacity-50" style={{ color: 'var(--text-secondary)' }}>
                                    Q. {post.sentence.content}
                                </div>
                                <div className="text-xl leading-relaxed font-hand" style={{ color: 'var(--text-primary)' }}>
                                    {post.content}
                                </div>
                                <div className="flex justify-end mt-6 text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-color)' }}>
                                    Like {post._count.likes}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <footer className="py-16 text-center opacity-20">
                    <p className="text-[10px] font-mono tracking-widest uppercase">
                        Human Text © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
