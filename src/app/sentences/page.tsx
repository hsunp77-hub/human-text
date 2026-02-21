'use client';

import { useState, useEffect } from 'react';
import { COURSE_CONTENT } from '@/lib/course-content';
import { getUserPosts, getUserProfile, getParticipantCount } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Pagination from '@/components/Pagination';

export default function SentencesPage() {
    const router = useRouter();
    const [writtenSentences, setWrittenSentences] = useState<Set<number>>(new Set());
    const [participantCounts, setParticipantCounts] = useState<Record<number, number>>({});
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [groupCode, setGroupCode] = useState<string>('G1');
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 5;

    useEffect(() => {
        const init = async () => {
            const id = localStorage.getItem('human_text_id');
            if (!id) {
                // If no ID, maybe redirect to onboarding or login?
                // For now, load default G1
                setLoading(false);
                return;
            }

            try {
                // Fetch User Profile to get Group
                const user = await getUserProfile(id) as any;
                if (user?.sentenceGroup) {
                    setGroupCode(user.sentenceGroup);
                } else {
                    // If user exists but no group, maybe they need onboarding?
                    // Redirect to onboarding if not signed up fully?
                    // For now, default G1
                }

                // Fetch User Posts to determine progress
                const { posts } = await getUserPosts(id, 1, 100);
                if (posts) {
                    // Map posts to dayIndex
                    // post.sentence.dayIndex
                    const writtenDays = new Set<number>(posts.map((p: any) => p.sentence.dayIndex));
                    setWrittenSentences(writtenDays);
                }
            } catch (error) {
                console.error("Failed to fetch user status:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const userGroupContent = COURSE_CONTENT[groupCode] || COURSE_CONTENT['G1'];
    const sentences = userGroupContent.sentences;

    // Pagination logic
    const startIndex = (page - 1) * itemsPerPage;
    const currentPrompts = sentences.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(sentences.length / itemsPerPage);

    useEffect(() => {
        const fetchCounts = async () => {
            const newCounts: Record<number, number> = {};
            for (let i = 0; i < currentPrompts.length; i++) {
                const globalIndex = startIndex + i;
                const dayIndex = globalIndex + 1;
                const count = await getParticipantCount(dayIndex);
                newCounts[dayIndex] = count;
            }
            setParticipantCounts(prev => ({ ...prev, ...newCounts }));
        };
        fetchCounts();
    }, [page, startIndex, currentPrompts.length]); // Re-run when page changes

    const handleCardClick = (e: React.MouseEvent, dayIndex: number, isLocked: boolean) => {
        e.preventDefault();
        if (isLocked) return;

        setSelectedDay(dayIndex);
        setTimeout(() => {
            router.push(`/write?day=${dayIndex}`);
        }, 600);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="app-container flex items-center justify-center text-white">Loading...</div>;
    }

    // Identify last completed day to determine unlocking
    // Max day written
    let maxWrittenDay = 0;
    writtenSentences.forEach(day => {
        if (day > maxWrittenDay) maxWrittenDay = day;
    });
    // The next day to write is maxWrittenDay + 1. 
    // BUT, users can only write Day N if Day N-1 is done.
    // So usually unlocked day = maxWrittenDay + 1.
    // Also Day 1 is always unlocked.
    const currentUnlockedDay = maxWrittenDay + 1;

    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <main className="w-full pb-20">
                    <Header title="첫문장 서랍" className="!mb-[80px] pt-6" />

                    <div className="text-center mb-8 text-white/50 text-sm">
                        {userGroupContent.age} {userGroupContent.gender !== '공통' ? userGroupContent.gender : ''}
                        - {userGroupContent.description}
                    </div>

                    <div className="relative w-full px-2 pt-10 pb-32">
                        {currentPrompts.map((prompt, index) => {
                            const globalIndex = startIndex + index;
                            const dayIndex = globalIndex + 1;

                            const isWritten = writtenSentences.has(dayIndex);
                            const isLocked = dayIndex > currentUnlockedDay && dayIndex > 1; // Day 1 always unlocked? 
                            // Actually logic: Day 1 unlock. Day 2 unlock if Day 1 written.
                            // dayIndex > maxWrittenDay + 1

                            // Adjusting locked logic:
                            // If I haven't written Day 1, Day 2 is locked.

                            const count = participantCounts[dayIndex] || 0;

                            const stickyTop = 40 + (index * 105);
                            const isLast = index === currentPrompts.length - 1;

                            let cardStyle: React.CSSProperties = {
                                textDecoration: 'none',
                                position: 'sticky',
                                top: `${stickyTop}px`,
                                height: isLast ? 'auto' : '190px',
                                minHeight: isLast ? '190px' : '190px',
                                zIndex: dayIndex,
                                marginBottom: isLast ? '120px' : '-85px',
                                marginTop: index === 0 ? '0' : undefined,
                                transition: 'all 0.5s ease-in-out',
                                filter: isLocked ? 'grayscale(1) brightness(0.5)' : 'none',
                                pointerEvents: isLocked ? 'none' : 'auto',
                            };

                            if (selectedDay !== null) {
                                if (dayIndex === selectedDay) {
                                    cardStyle = {
                                        ...cardStyle,
                                        transform: 'translateY(-20px) scale(1.02)',
                                        zIndex: 100,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    };
                                } else if (dayIndex > selectedDay) {
                                    cardStyle = {
                                        ...cardStyle,
                                        transform: 'translateY(100vh)',
                                        opacity: 0,
                                    };
                                } else {
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
                                    href={isLocked ? '#' : `/write?day=${dayIndex}`}
                                    onClick={(e) => handleCardClick(e, dayIndex, isLocked)}
                                    className="index-card block w-full group"
                                    style={cardStyle}
                                >
                                    <div
                                        className="index-card-tab"
                                        style={{ left: `${10 + (index % 4) * 22}%` }}
                                    >
                                        index {String(dayIndex).padStart(3, '0')}
                                        {isLocked && <span className="ml-2 text-xs">🔒</span>}
                                    </div>

                                    <div className="index-card-inner">
                                        <div
                                            className="absolute top-4"
                                            style={{ right: '24px', textAlign: 'right' }}
                                        >
                                            <div className="index-card-meta" style={{ fontSize: '10px', opacity: 0.6 }}>
                                                문단수 {count.toLocaleString()}
                                            </div>
                                        </div>

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

                    {/* Pagination Controls */}
                    <div style={{ marginTop: '60px', marginBottom: '40px' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </main>
                <Footer pageContext="sentences" />
            </div>
        </div>
    );
}
