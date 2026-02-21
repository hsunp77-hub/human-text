import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSentenceByDay, getCurrentSentenceForUser, getUserProfile } from '@/lib/actions';

interface DailySentence {
    id: string;
    content: string;
    dayIndex?: number;
    groupCode?: string;
    date?: Date | string; // legacy support if needed
}

export function useSentence() {
    const searchParams = useSearchParams();
    const dayParam = searchParams.get('day');
    const [sentence, setSentence] = useState<any>(null); // Use any to avoid type issues with stale client
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSentence = async () => {
            setIsLoading(true);
            try {
                const userId = localStorage.getItem('human_text_id');

                let data;
                let groupCode = 'G1';

                if (userId) {
                    const user = await getUserProfile(userId) as any;
                    if (user?.sentenceGroup) groupCode = user.sentenceGroup;
                }

                if (dayParam) {
                    const dayNumber = parseInt(dayParam);
                    if (!isNaN(dayNumber)) {
                        data = await getSentenceByDay(dayNumber, groupCode);
                    }
                } else {
                    if (userId) {
                        data = await getCurrentSentenceForUser(userId);
                    } else {
                        data = await getSentenceByDay(1, 'G1');
                    }
                }

                setSentence(data);

                if (data && !dayParam && typeof window !== 'undefined' && data.dayIndex) {
                    window.history.replaceState(null, '', `?day=${data.dayIndex}`);
                }

            } catch (error) {
                console.error("Error fetching sentence:", error);
                try {
                    const { COURSE_CONTENT } = await import('@/lib/course-content');
                    const fallbackContent = COURSE_CONTENT['G1'].sentences[0];
                    setSentence({
                        id: 'fallback',
                        content: fallbackContent,
                        dayIndex: 1,
                        groupCode: 'G1'
                    });
                } catch (e) { }
            } finally {
                setIsLoading(false);
            }
        };
        fetchSentence();
    }, [dayParam]);

    return { sentence, isLoading, dayParam };
}
