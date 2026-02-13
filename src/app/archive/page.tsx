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
            <div className="mobile-view p-6 pt-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white">나의 기록</h1>
                    <Link href="/" className="text-sm font-semibold transition-colors hover:text-white" style={{ color: '#71717A' }}>
                        ← 홈으로
                    </Link>
                </header>

                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <p className="text-[#A1A1AA] text-lg mb-6">아직 남긴 기록이 없습니다.</p>
                        <Link
                            href="/"
                            className="bg-white text-black px-8 py-3 rounded-full font-semibold transition-transform hover:scale-105"
                        >
                            오늘의 문장에 답하기
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all hover:bg-white/10">
                                <div className="text-xs font-semibold mb-3 tracking-wider" style={{ color: '#71717A' }}>
                                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="text-sm font-medium mb-4 italic" style={{ color: '#A1A1AA' }}>
                                    Q. {post.sentence.content}
                                </div>
                                <div className="text-lg leading-relaxed text-[#E4E4E7] font-hand">
                                    {post.content}
                                </div>
                                <div className="flex justify-end mt-4 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#71717A' }}>
                                    Like {post._count.likes}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <footer className="py-12 text-center">
                    <p className="text-[10px] opacity-30" style={{ color: '#71717A' }}>
                        Human Text. 2026.
                    </p>
                </footer>
            </div>
        </div>
    );
}
