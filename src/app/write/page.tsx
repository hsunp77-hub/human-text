"use client";

import { useState } from "react";
import styles from "./write.module.css";

export default function WritePage() {
    const [text, setText] = useState("");
    const prompt = "창문을 여니 햇살이 소나기처럼 쏟아졌다";
    const MAX_CHARS = 500;

    // Get current date
    const today = new Date().toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
    });

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

                    {/* Prompt Section */}
                    <div className={styles.promptArea}>
                        <p className={styles.promptText}>{prompt}</p>
                    </div>

                    {/* Writing Area */}
                    <textarea
                        className={`${styles.writingArea} font-hand`}
                        value={text}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                        }}
                        placeholder="두번째 문장이 기다리고 있어요"
                        spellCheck={false}
                    />

                    {/* Character Count (Subtle) */}
                    <div className="text-right text-secondary text-sm mt-2 opacity-30">
                        {text.length} / {MAX_CHARS}
                    </div>

                    {/* Record Button at Bottom Center */}
                    <div className={styles.bottomNav}>
                        <button className={styles.recordBtn}>기록</button>
                    </div>

                </div>

            </div>
        </div>
    );
}
