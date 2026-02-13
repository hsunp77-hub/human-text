"use client";

import { useState } from "react";
import styles from "./write.module.css";

export default function WritePage() {
    const [text, setText] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const prompt = "창문을 여니 햇살이 소나기처럼 쏟아졌다";
    const MAX_CHARS = 500;

    // Get current date
    const today = new Date().toLocaleDateString('ko-KR', {
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
            <div className="mobile-view p-6">

                {/* Date at Top Right */}
                <div className="absolute top-6 right-6 text-secondary text-sm font-semibold">
                    {today}
                </div>

                <div className={styles.writeContainer}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <p className={styles.categoryText}>당신의 인생의 한 순간을 떠올려주세요</p>
                        <h1 className="text-title">오늘</h1>
                    </div>

                    {/* Cumulative Passage Section */}
                    <div className={styles.passageArea}>
                        <p className={styles.historyText}>
                            <span className={styles.promptInPassage}>{prompt}</span>
                            {history.map((sentence, index) => (
                                <span key={index} className={styles.sentence}>
                                    {" "}{sentence}
                                </span>
                            ))}
                        </p>
                    </div>

                    {/* Writing Area */}
                    <textarea
                        className={`${styles.writingArea} font-hand`}
                        value={text}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                        }}
                        placeholder="이어서 이야기를 적어주세요..."
                        spellCheck={false}
                        autoFocus
                    />

                    {/* Character Count & Reset Button */}
                    <div className="flex justify-between items-center mt-2 opacity-30">
                        <button 
                            onClick={handleReset}
                            className="text-xs hover:text-white transition-colors"
                        >
                            초기화
                        </button>
                        <div className="text-right text-secondary text-sm">
                            {text.length} / {MAX_CHARS}
                        </div>
                    </div>

                    {/* Record Button at Bottom Center */}
                    <div className={styles.bottomNav}>
                        <button 
                            className={`${styles.recordBtn} ${!text.trim() ? styles.disabled : ''}`}
                            onClick={handleRecord}
                            disabled={!text.trim()}
                        >
                            기록
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
