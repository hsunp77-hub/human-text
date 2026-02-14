'use client';

import { useState } from 'react';
import { DAILY_PROMPTS } from '@/lib/sentences';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`pagination-number ${page === pageNum ? 'active' : ''}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </main>

                <Footer pageContext="sentences" />
            </div>
        </div>
    );
}
