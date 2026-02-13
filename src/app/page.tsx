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

  return (
    <div className="app-container">
      <div className="mobile-view px-8 items-center">

        {/* Date - Now part of the flex flow for better centering */}
        <div className="text-sm font-semibold tracking-tight mb-4 opacity-50" style={{ color: 'var(--accent-color)' }}>
          {today}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center w-full">

          {/* Logo/Title Area */}
          <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl font-bold mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              오늘.
            </h1>
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
              당신의 인생의 한 순간을 떠올려보세요.
            </p>
          </div>

          {/* Today's Sentence Card */}
          <div className={`w-full max-w-md mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="glass-card p-8">
              <p className="text-xs font-bold mb-4 uppercase tracking-[0.2em]" style={{ color: 'var(--accent-color)' }}>
                오늘의 문장
              </p>
              <p className="text-2xl leading-relaxed mb-8 font-light italic" style={{ color: 'var(--text-primary)' }}>
                창문을 여니 햇살이 소나기처럼 쏟아졌다.
              </p>

              {/* Writing Area */}
              <div className="relative mb-8">
                <textarea
                  className="w-full bg-black/30 border border-white/5 rounded-2xl p-6 text-white text-xl leading-relaxed resize-none outline-none min-h-[180px] font-hand placeholder:text-white/10"
                  value={text}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                  }}
                  placeholder="두 번째 문장이 기다리고 있어요..."
                  spellCheck={false}
                  rows={5}
                />
                <div className="absolute bottom-4 right-6 text-xs font-mono opacity-20" style={{ color: 'var(--text-secondary)' }}>
                  {text.length} / {MAX_CHARS}
                </div>
              </div>

              {/* Record Button */}
              <button
                className={`flex items-center justify-center gap-2 w-full text-center py-5 rounded-full font-bold text-lg transition-all duration-500 ${text.length > 0 ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                disabled={text.length === 0}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m11 4 4 4-10.5 10.5c-.77.77-2.36 1-3 .5s-.27-2.23.5-3Z" />
                  <path d="m11 4 7-2 4 4-2 7Z" />
                  <path d="m15 8 4 4" />
                </svg>
                기록하기
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`flex items-center gap-10 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/archive"
              className="text-sm font-semibold tracking-wide transition-all hover:text-white hover:scale-105"
              style={{ color: 'var(--accent-color)' }}
            >
              내 기록
            </Link>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide transition-all hover:text-white hover:scale-105"
              style={{ color: 'var(--accent-color)' }}
            >
              소개
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-10 left-0 right-0 text-center opacity-20">
          <p className="text-[10px] font-mono tracking-widest uppercase">
            Human Text © 2026
          </p>
        </div>

      </div>
    </div>
  );
}

