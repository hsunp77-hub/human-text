"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPost, getTodaySentence } from "@/lib/actions";
import { v4 as uuidv4 } from 'uuid';

export default function WritePage() {
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

        // Fetch today's sentence
        const fetchSentence = async () => {
            const data = await getTodaySentence();
            setSentence(data);
        };
        fetchSentence();
    }, []);

    const prompt = "창문을 여니 햇살이 소나기처럼 쏟아졌다.";
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

            const result = await createPost(formData);
            if (result.success) {
                setHistory(prev => [...prev, { content: text.trim(), id: result.post.id }]);
                setText("");
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

                {/* Date at Top Right */}
                <div className="top-nav">{today}</div>

                <div className="content w-full flex flex-col items-center">
                    {/* Header Section */}
                    <div className="header">
                        <h1>오늘</h1>
                        <p className="subtitle">당신 인생의 한순간을 떠올려보세요.</p>
                    </div>

                    {/* Writing Card Section */}
                    <div className="glass-card">
                        <div className="flex justify-between items-start mb-2">
                            <div className="card-label">오늘의 문장</div>
                        </div>

                        <div className="sentence-preview">
                            <span className="opacity-50 mr-1">{prompt}</span>
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
                            placeholder="두번째 문장이 기다리고 있어요..."
                            spellCheck={false}
                            autoFocus
                        />

                        {/* Buttons Section */}
                        <div className="flex justify-center w-full px-4 mt-4">
                            <div className="flex gap-3 justify-center w-full max-w-[320px]">
                                <button
                                    className={`record-btn flex-1 ${text.trim().length > 0 ? 'btn-active' : 'btn-disabled'}`}
                                    onClick={handleRecord}
                                    disabled={text.trim().length === 0}
                                >
                                    기록
                                </button>
                                {history.length > 0 && (
                                    <button
                                        className="record-btn flex-1 btn-active"
                                        onClick={handleEdit}
                                    >
                                        수정
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="footer-nav">
                        <Link href="/archive" className="cursor-pointer">나의 문장들</Link>
                        <span className="nav-dot">•</span>
                        <Link href="/about" className="cursor-pointer">소개</Link>
                    </div>
                </div>

                {/* Bottom Tag - Correct Casing */}
                <div className="bottom-tag">Human Text. 2026.</div>

            </div>
        </div>
    );
}
