"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createPost, getTodaySentence, getSentenceByDay } from "@/lib/actions";
import { v4 as uuidv4 } from 'uuid';
import Header from "@/components/Header";

function WriteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dayParam = searchParams.get('day');
    const [text, setText] = useState("");
    const [history, setHistory] = useState<any[]>([]);
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
                        console.warn(`Day ${dayNumber} not found, falling back to today's sentence`);
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

    const MAX_CHARS = 1000;

    // Get current date
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleRecord = async () => {
        if (text.trim() && sentence && userId) {
            const formData = new FormData();
            formData.append('content', text.trim());
            formData.append('authorId', userId);
            formData.append('sentenceId', sentence.id);

            try {
                const result = await createPost(formData);
                if (result.success) {
                    setHistory(prev => [...prev, { content: text.trim(), id: result.post.id }]);
                    setText("");
                    alert("기록이 안전하게 저장되었습니다.");
                } else {
                    alert(result.error || "저장에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (err) {
                alert("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
            }
        }
    };

    const handleEdit = () => {
        if (history.length > 0) {
            const lastPost = history[history.length - 1];
            // In a real app, you might want to DELETE the post from the DB here too,
            // but for now we'll just remove it from local history to allow re-typing.
            setHistory(prev => prev.slice(0, -1));
            setText(lastPost.content);
        }
    };

    return (
        <div className="app-container">
            <div className="mobile-view">

                {/* Unified Header */}
                <Header
                    title="그날"
                    label={dayParam ? `DAY ${dayParam}` : undefined}
                />

                <div className="content w-full flex flex-col items-center">

                    {/* Writing Card Section */}
                    <div className="glass-card">
                        <div className="flex justify-center items-start mb-4">
                            <div className="card-label">시작하는 문장</div>
                        </div>

                        <div className="sentence-preview">
                            <span className="opacity-50 mr-1">{sentence?.content || "..."}</span>
                            {history.map((item, index) => (
                                <span key={index} className="text-white">
                                    {" "}{item.content}
                                </span>
                            ))}
                        </div>

                        {/* Minimal Writing Input */}
                        <textarea
                            className="textarea-minimal"
                            value={text}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                            }}
                            placeholder="이어지는 당신의 이야기를 담아주세요..."
                            spellCheck={false}
                            autoFocus
                        />

                        {/* Buttons Section */}
                        <div className="flex flex-col items-center w-full mt-6 gap-4">
                            <div className="text-[11px] font-serif text-white/40 mb-2 tracking-widest uppercase">
                                {today}
                            </div>
                            <button
                                className={`premium-btn w-full max-w-[200px]`}
                                onClick={handleRecord}
                                disabled={text.trim().length === 0}
                            >
                                기록의 완성
                            </button>
                            {history.length > 0 && (
                                <button
                                    className="edit-btn w-full max-w-[140px]"
                                    onClick={handleEdit}
                                >
                                    문장 수정
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="footer-nav font-serif">
                        <Link href="/sentences" className="cursor-pointer hover:text-white transition-colors">문장의 날짜</Link>
                        <span className="nav-dot">•</span>
                        <Link href="/archive" className="cursor-pointer hover:text-white transition-colors">나의 문장들</Link>
                        <span className="nav-dot">•</span>
                        <Link href="/about" className="cursor-pointer hover:text-white transition-colors">소개</Link>
                    </div>
                </div>

                {/* Bottom Tag - Formal Serif */}
                <div className="bottom-tag font-serif">Human Text © 2026.</div>

            </div>
        </div>
    );
}

export default function WritePage() {
    return (
        <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
            <WriteContent />
        </Suspense>
    );
}

