"use client";

import { useState } from "react";

export default function WritePage() {
    const [text, setText] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const prompt = "창문을 여니 햇살이 소나기처럼 쏟아졌다";
    const MAX_CHARS = 1000;

    // Get current date
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleRecord = () => {
        if (text.trim()) {
            setHistory(prev => [...prev, text.trim()]);
            setText("");
        }
    };

    const handleReset = () => {
        if (confirm("기록을 초기화하시겠습니까?")) {
            setHistory([]);
            setText("");
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
                        <p className="subtitle">당신의 인생의 한순간을 떠올려보세요.</p>
                    </div>

                    {/* Writing Card Section */}
                    <div className="glass-card">
                        <div className="flex justify-between items-start mb-2">
                            <div className="card-label">오늘의 문장</div>
                            <button
                                onClick={handleReset}
                                className="text-[10px] uppercase tracking-wider text-secondary hover:text-white transition-colors opacity-30"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="sentence-preview">
                            <span className="opacity-50 mr-1">{prompt}</span>
                            {history.map((sentence, index) => (
                                <span key={index} className="text-white">
                                    {" "}{sentence}
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

                        {/* Record Button - No Icon, Matching Preview Style */}
                        <button
                            className={`record-btn ${text.trim().length > 0 ? 'btn-active' : 'btn-disabled'}`}
                            onClick={handleRecord}
                            disabled={text.trim().length === 0}
                        >
                            기록
                        </button>
                    </div>

                    {/* Footer Navigation */}
                    <div className="footer-nav">
                        <span className="cursor-pointer">내 기록 보기</span>
                        <span className="nav-dot">•</span>
                        <span className="cursor-pointer">소개</span>
                    </div>
                </div>

                {/* Bottom Tag - Correct Casing */}
                <div className="bottom-tag">Human Text. 2026.</div>

            </div>
        </div>
    );
}
