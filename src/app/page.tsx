"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const MAX_CHARS = 500;

  // Get current date
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-container">
      <div className="mobile-view">

        {/* Date at Top Right */}
        <div className="top-nav">{today}</div>

        <div className="content w-full flex flex-col items-center">

          {/* Header Area */}
          <div className="header">
            <h1>오늘</h1>
            <p className="subtitle">당신의 인생의 한순간을 떠올려보세요.</p>
          </div>

          {/* Writing Card Section */}
          <div className="glass-card">
            <div className="card-label">오늘의 문장</div>
            <div className="sentence-preview">창문을 여니 햇살이 소나기처럼 쏟아졌다</div>

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
              disabled={text.trim().length === 0}
            >
              기록
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="footer-nav">
            <Link href="/archive">내 기록 보기</Link>
            <span className="nav-dot">•</span>
            <Link href="/about">소개</Link>
          </div>
        </div>

        {/* Bottom Tag - Correct Casing */}
        <div className="bottom-tag">Human Text. 2026.</div>
      </div>
    </div>
  );
}
