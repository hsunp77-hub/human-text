'use client';

import { useState } from 'react';
import { DAILY_PROMPTS } from '@/lib/sentences';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function SentencesPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (page - 1) * itemsPerPage;
    const currentPrompts = DAILY_PROMPTS.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(DAILY_PROMPTS.length / itemsPerPage);

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6 flex flex-col h-screen overflow-hidden">

                {/* Unified Header */}
                <Header title="문장의 날짜" />

                <main className="w-full flex-1 flex flex-col justify-between overflow-hidden max-w-[432px] mx-auto">
                    <div className="space-y-3 w-full">
                        {currentPrompts.map((prompt, index) => {
                            const dayIndex = startIndex + index + 1;
                            return (
                                <Link
                                    key={dayIndex}
                                    href={`/write?day=${dayIndex}`}
                                    className="archive-card block hover:no-underline min-h-[105px] flex flex-col justify-center py-4 w-full"
                                >
                                    <div className="archive-card-date">
                                        DAY {dayIndex}
                                    </div>
                                    <div className="archive-card-content font-serif italic text-[17px] mb-0 text-white leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
                                        "{prompt}"
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center py-8 px-2 shrink-0 w-full">
                        <button
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className={`edit-btn text-sm w-[80px] flex justify-center ${page === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                        >
                            이전
                        </button>
                        <div className="text-[#71717A] text-sm font-serif min-w-[50px] text-center">
                            {page} / {totalPages}
                        </div>
                        <button
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className={`edit-btn text-sm w-[80px] flex justify-center ${page === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}
                        >
                            다음
                        </button>
                    </div>
                </main>

                <footer className="py-6 text-center opacity-30 shrink-0">
                    <p className="text-[10px] tracking-widest uppercase text-gray-500">
                        Human Text © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
