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

            {/* Record Button with Fountain Pen Icon */}
            <button
              className={`record-btn ${text.length > 0 ? 'btn-active' : 'btn-disabled'}`}
              disabled={text.length === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 4 4 4-10.5 10.5c-.77.77-2.36 1-3 .5s-.27-2.23.5-3Z" />
                <path d="m11 4 7-2 4 4-2 7Z" />
                <path d="m15 8 4 4" />
              </svg>
              <span>기록</span>
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="footer-nav">
            <Link href="/archive">내 기록 보기</Link>
            <span className="nav-dot">•</span>
            <Link href="/about">소개</Link>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="bottom-tag">HUMAN TEXT. 2026.</div>
      </div>
    </div>
  );
}
