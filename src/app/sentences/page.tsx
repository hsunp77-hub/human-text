'use client';

import { useState, useEffect } from 'react';
import { DAILY_PROMPTS } from '@/lib/sentences';
import { getUserPosts, getParticipantCount } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';

export default function SentencesPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [writtenSentences, setWrittenSentences] = useState<Set<string>>(new Set());
    const [participantCounts, setParticipantCounts] = useState<Record<number, number>>({});
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserStatus = async () => {
            const id = localStorage.getItem('human_text_id');
            if (!id) return;

            try {
                // Fetch user's posts to check which sentences they've written
                const { posts } = await getUserPosts(id, 1, 100);
                if (posts) {
                    const written = new Set<string>(posts.map((p: any) => String(p.sentence.content)));
                    setWrittenSentences(written);
                }
            } catch (error) {
                console.error("Failed to fetch user status:", error);
            }
        };
        fetchUserStatus();
    }, []);

    const startIndex = (page - 1) * itemsPerPage;
    const currentPrompts = DAILY_PROMPTS.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(DAILY_PROMPTS.length / itemsPerPage);

    useEffect(() => {
        const fetchCounts = async () => {
            const newCounts: Record<number, number> = {};
            for (let i = 0; i < currentPrompts.length; i++) {
                const dayIndex = startIndex + i + 1;
                const count = await getParticipantCount(dayIndex);
                newCounts[dayIndex] = count;
            }
            setParticipantCounts(prev => ({ ...prev, ...newCounts }));
        };
        fetchCounts();
    }, [page, startIndex]); // Dependencies for fetching counts when page changes

    const handleCardClick = (e: React.MouseEvent, dayIndex: number) => {
        e.preventDefault();
        setSelectedDay(dayIndex);
        setTimeout(() => {
            router.push(`/write?day=${dayIndex}`);
        }, 600);
    };

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6 flex flex-col h-screen">

                {/* Unified Header */}
                <Header title="문장의 날짜" />

                <main className="w-full flex-1 flex flex-col overflow-y-auto no-scrollbar max-w-[432px] mx-auto pb-20">
                    {/* Main Content - Sticky Index Stack */}
                    <div className="relative w-full px-2 min-h-0">
                        {currentPrompts.map((prompt, index) => {
                            const dayIndex = startIndex + index + 1;
                            const isWritten = writtenSentences.has(prompt);
                            const count = participantCounts[dayIndex] || 0;

                            // Calculate sticky top position based on index (Stacking effect)
                            // Interval set to ~130px (allows visibility of Day + Sentence)
                            const stickyTop = 0 + (index * 130);
                            const isLast = index === currentPrompts.length - 1;

                            // Animation Styles
                            let cardStyle: React.CSSProperties = {
                                textDecoration: 'none',
                                position: 'sticky',
                                top: `${stickyTop}px`,
                                height: isLast ? 'auto' : '240px', // Reduced from 350px
                                minHeight: isLast ? '240px' : '240px',
                                zIndex: dayIndex,
                                marginBottom: isLast ? '40px' : '-110px', // Adjusted for 240px height & 130px visible
                                transition: 'all 0.5s ease-in-out',
                            };

                            if (selectedDay !== null) {
                                if (dayIndex === selectedDay) {
                                    // Selected card pops slightly
                                    cardStyle = {
                                        ...cardStyle,
                                        transform: 'translateY(-20px) scale(1.02)',
                                        zIndex: 100, // Bring to front
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    };
                                } else if (dayIndex > selectedDay) {
                                    // Cards below slide down and fade out
                                    cardStyle = {
                                        ...cardStyle,
                                        transform: 'translateY(100vh)',
                                        opacity: 0,
                                    };
                                } else {
                                    // Cards above fade out
                                    cardStyle = {
                                        ...cardStyle,
                                        opacity: 0,
                                        transform: 'translateY(-50px)',
                                    };
                                }
                            }

                            return (
                                <Link
                                    key={dayIndex}
                                    href={`/write?day=${dayIndex}`}
                                    onClick={(e) => handleCardClick(e, dayIndex)}
                                    className="index-card block w-full group"
                                    style={cardStyle}
                                >
                                    <div className="index-card-inner">
                                        {/* Day Header */}
                                        <div className="index-card-header">
                                            <div className="index-card-day">
                                                Day {dayIndex}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="index-card-meta">
                                                    INDEX {String(dayIndex).padStart(3, '0')}
                                                </div>
                                                <div className="index-card-meta mt-1">
                                                    문단수 {count.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sentence Content */}
                                        <div className={`index-card-content flex-1 transition-all duration-300 ${isWritten ? 'font-bold text-white not-italic' : 'text-[#E4E4E7]'}`}>
                                            "{prompt}"
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {/* Pagination Controls */}
                    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </main>

                <Footer pageContext="sentences" />
            </div>
        </div>
    );
}
