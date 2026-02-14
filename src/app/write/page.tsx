"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createPost, getTodaySentence, getSentenceByDay } from "@/lib/actions";
import { v4 as uuidv4 } from 'uuid';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function WriteContent() {
    const searchParams = useSearchParams();
    const dayParam = searchParams.get('day');

    // State
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sentence, setSentence] = useState<any>(null);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        // Initialize userId
        let id = localStorage.getItem('human_text_id');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('human_text_id', id);
        }
        if (id) setUserId(id);

        // Fetch sentence
        const fetchSentence = async () => {
            let data;
            if (dayParam) {
                const dayNumber = parseInt(dayParam);
                if (isNaN(dayNumber)) {
                    console.error('Invalid day parameter:', dayParam);
                    data = await getTodaySentence();
                } else {
                    data = await getSentenceByDay(dayNumber);
                    // Fallback to today's sentence if the requested day is invalid
                    if (!data) {
                        data = await getTodaySentence();
                    }
                }
            } else {
                data = await getTodaySentence();
            }
            setSentence(data);
        };
        fetchSentence();
    }, [dayParam]);

    // Derived values
    const todayDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const day = dayParam || (sentence ? new Date(sentence.createdAt).getDate() : 'N/A');
    const currentPrompt = sentence?.content || "...";

    const handleSubmit = async () => {
        if (!content.trim() || !sentence || !userId) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content.trim());
        formData.append('authorId', userId);
        formData.append('sentenceId', sentence.id);

        try {
            const result = await createPost(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                alert(result.error || "저장에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (err) {
            alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <div className="mobile-view write-view px-6">

                {/* Unified Header */}
                <Header title="그날" />

                <div className="write-container flex flex-col items-center justify-center flex-1 w-full max-w-[340px] mx-auto min-h-0">

                    {/* Main Card */}
                    <div className="glass-card w-full p-8 relative flex flex-col items-center text-center mb-8">
                        {/* Day Label */}
                        <div className="header-label">
                            DAY {day}
                        </div>

                        {/* Sentence */}
                        {!submitted && (
                            <div className="sentence-preview">
                                "{currentPrompt}"
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="w-full relative">
                            {submitted ? (
                                <div
                                    className="textarea-minimal w-full h-[200px] resize-none overflow-y-auto"
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        color: 'white',
                                        fontSize: '18px',
                                        textAlign: 'center',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {currentPrompt} {content}
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        className="textarea-minimal w-full h-[200px] resize-none"
                                        placeholder="문장을 읽고 떠오르는 당신의 이야기를 기록해주세요..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        maxLength={500}
                                        spellCheck={false}
                                    />

                                </>
                            )}

                            {/* Action Buttons inside Input Area because of relative positioning? No, they were inside relative in my previous failed attempts. 
                                Let's move them OUT of 'w-full relative' if possible, or keep them in. 
                                Design-wise, they are just below. 
                                I will place them AFTER the textarea div. 
                            */}
                        </div>

                        {/* Counter & Date */}
                        <div className="flex flex-col gap-1 mb-80 w-full" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <span style={{ fontSize: '10px', color: '#71717A', fontFamily: 'var(--font-serif)', letterSpacing: '0.1em', opacity: 0.8 }}>
                                    {content.length} / 500
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <span style={{ fontSize: '10px', color: '#71717A', fontFamily: 'var(--font-serif)', letterSpacing: '0.1em', opacity: 0.8 }}>
                                    {todayDate}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="center-flex-col mt-48">
                            {!submitted ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !content.trim()}
                                    className="premium-btn w-full max-w-[200px]"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </span>
                                    ) : "기록의 완성"}
                                </button>

                            ) : (
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="premium-btn w-full max-w-[200px]"
                                >
                                    문장 수정
                                </button>
                            )}
                        </div>
                    </div>

                    <Footer pageContext="write" />
                </div>
            </div>
        </div >
    );
}

export default function WritePage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
            <WriteContent />
        </Suspense>
    );
}
