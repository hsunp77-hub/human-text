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
    const [writtenSentences, setWrittenSentences] = useState<Set<string>>(new Set());
    const [participantCounts, setParticipantCounts] = useState<Record<number, number>>({});
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    // const itemsPerPage = 5;

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

    // const startIndex = (page - 1) * itemsPerPage;
    const currentPrompts = DAILY_PROMPTS;
    // const totalPages = Math.ceil(DAILY_PROMPTS.length / itemsPerPage);

    useEffect(() => {
        const fetchCounts = async () => {
            const newCounts: Record<number, number> = {};
            for (let i = 0; i < currentPrompts.length; i++) {
                const dayIndex = i + 1;
                const count = await getParticipantCount(dayIndex);
                newCounts[dayIndex] = count;
            }
            setParticipantCounts(prev => ({ ...prev, ...newCounts }));
        };
        fetchCounts();
    }, []); // Fetch all once on mount

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
                <Header title="첫문장 서랍" className="!mb-[80px]" />

                <main className="w-full flex-1 flex flex-col overflow-y-auto no-scrollbar max-w-[432px] mx-auto pb-20">
                    {/* Main Content - Sticky Index Stack */}
                    <div className="relative w-full px-2 pt-10 min-h-0">
                        {currentPrompts.map((prompt, index) => {
                            const dayIndex = index + 1;
                            const isWritten = writtenSentences.has(prompt);
                            const count = participantCounts[dayIndex] || 0;

                            // Calculate sticky top position based on index (Stacking effect)
                            // Interval set for visibility of Index + Count + Sentence
                            const stickyTop = 0 + (index * 110);
                            const isLast = index === currentPrompts.length - 1;

                            // Animation Styles
                            let cardStyle: React.CSSProperties = {
                                textDecoration: 'none',
                                position: 'sticky',
                                top: `${stickyTop}px`,
                                height: isLast ? 'auto' : '190px',
                                minHeight: isLast ? '190px' : '190px',
                                zIndex: dayIndex,
                                marginBottom: isLast ? '40px' : '-80px', // Adjusted for 190px height & 110px visible
                                marginTop: index === 0 ? '0' : undefined,
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

                            // Staggered tab positions (left, mid-left, mid, mid-right, right)
                            const tabPosition = (index % 5) * 20; // 0%, 20%, 40%, 60%, 80% approximately

                            return (
                                <Link
                                    key={dayIndex}
                                    href={`/write?day=${dayIndex}`}
                                    onClick={(e) => handleCardClick(e, dayIndex)}
                                    className="index-card block w-full group"
                                    style={cardStyle}
                                >
                                    {/* Index Tab */}
                                    <div
                                        className="index-card-tab"
                                        style={{ left: `${10 + (index % 4) * 22}%` }}
                                    >
                                        index {String(dayIndex).padStart(3, '0')}
                                    </div>

                                    <div className="index-card-inner">
                                        {/* Meta Group (Top Right) - Simplified to just count */}
                                        <div
                                            className="absolute top-4"
                                            style={{ right: '24px', textAlign: 'right' }}
                                        >
                                            <div className="index-card-meta" style={{ fontSize: '10px', opacity: 0.6 }}>
                                                문단수 {count.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Sentence Content */}
                                        <div className={`index-card-content flex-1 flex items-start justify-center pt-18 pb-8 transition-all duration-300 ${isWritten ? 'font-bold text-white not-italic' : 'text-[#E4E4E7]'}`}>
                                            <span className="text-center max-w-[85%] text-sm">
                                                "{prompt}"
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* No Pagination - List scrolls instead */}
                </main>

                <Footer pageContext="sentences" />
            </div>
        </div>
    );
}
