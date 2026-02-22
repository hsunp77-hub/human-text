"use client";

import { useState, useEffect, Suspense } from "react";
import { createPost } from "@/lib/actions";
import { v4 as uuidv4 } from 'uuid';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSentence } from "@/hooks/useSentence";

export const dynamic = 'force-dynamic';

function WriteContent() {
    const { sentence, dayParam } = useSentence();

    // State
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        // Initialize userId
        let id = localStorage.getItem('human_text_id');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('human_text_id', id);
        }
        if (id) setUserId(id);
    }, []);

    // Derived values
    const todayDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // Use 'date' field from sentence to determine Day number if available
    const day = dayParam || (sentence ? new Date(sentence.date).getDate() : 'N/A');
    const currentPrompt = sentence?.content || "...";

    const handleSubmit = async () => {
        if (!content.trim() || !sentence || !userId) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content.trim());
        formData.append('authorId', userId);
        formData.append('sentenceId', sentence.id);

        // Optimistic / Fallback Save to LocalStorage
        const localPost = {
            id: uuidv4(), // Generate a local ID
            content: content.trim(),
            createdAt: new Date().toISOString(),
            sentence: {
                content: sentence.content
            },
            _count: {
                likes: 0,
                comments: 0
            },
            authorId: userId
        };

        try {
            const savedPosts = localStorage.getItem('human_text_posts');
            const posts = savedPosts ? JSON.parse(savedPosts) : [];
            posts.unshift(localPost); // Add to beginning
            localStorage.setItem('human_text_posts', JSON.stringify(posts));
        } catch (e) {
            console.error("Failed to save locally", e);
        }

        try {
            const result = await createPost(formData);
            if (result.success) {
                setSubmitted(true);
            } else {
                console.error("Save failed:", result.error);
                // Even if server fails, we have saved locally, so we show success state to user
                setSubmitted(true);
            }
        } catch (err) {
            console.error("Network error:", err);
            // Even if network error, local save succeeded
            setSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <div className="mobile-view write-view px-6">

                {/* Unified Header */}
                <Header title="나의 그날" />

                <div className="write-container flex flex-col items-center justify-center flex-1 w-full max-w-[340px] mx-auto min-h-0">

                    {/* Main Card */}
                    <div className="glass-card w-full p-8 relative flex flex-col items-center text-center mb-8">
                        {/* Day Label */}
                        <div className="header-label">
                            index {String(day).padStart(3, '0')}
                        </div>

                        {/* Sentence */}
                        {!submitted && (
                            <div className="sentence-preview">
                                &quot;{currentPrompt}&quot;
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="w-full relative">
                            {submitted ? (
                                <div
                                    className="textarea-minimal w-full h-[200px] resize-none overflow-y-auto"
                                    style={{
                                        fontFamily: 'var(--font-sans)',
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

                        </div>

                        {/* Counter & Date */}
                        <div className="flex flex-col gap-1 mb-80 w-full" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <span style={{ fontSize: '10px', color: '#71717A', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', opacity: 0.8 }}>
                                    {content.length} / 500
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <span style={{ fontSize: '10px', color: '#71717A', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em', opacity: 0.8 }}>
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

                </div>

                <Footer pageContext="write" />
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
