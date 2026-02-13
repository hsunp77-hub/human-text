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
      <div className="mobile-view">

        {/* Date at Top */}
        <div className="absolute top-12 text-sm font-semibold tracking-tight opacity-40" style={{ color: 'var(--text-primary)' }}>
          {today}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center w-full">

          {/* Logo/Title Area */}
          <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-6xl font-bold mb-6 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              오늘
            </h1>
            <p className="text-xl font-medium tracking-tight opacity-60" style={{ color: 'var(--text-primary)' }}>
              당신의 인생의 한순간을 떠올려보세요.
            </p>
          </div>

          {/* Today's Sentence Card */}
          <div className={`w-full max-w-md mb-16 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="glass-card p-10 pb-8">
              <p className="text-[11px] font-bold mb-5 uppercase tracking-[0.2em] opacity-40" style={{ color: 'var(--text-primary)' }}>
                오늘의 문장
              </p>
              <p className="text-2xl leading-[1.6] mb-10 font-medium" style={{ color: 'var(--text-primary)' }}>
                창문을 여니 햇살이 소나기처럼 쏟아졌다
              </p>

              {/* Writing Area */}
              <div className="relative mb-10 bg-white/5 rounded-2xl p-6 min-h-[220px]">
                <textarea
                  className="w-full bg-transparent border-none text-white text-xl leading-relaxed resize-none outline-none font-hand placeholder:text-white/10"
                  value={text}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                  }}
                  placeholder="두번째 문장이 기다리고 있어요..."
                  spellCheck={false}
                  rows={6}
                />
              </div>

              {/* Record Button - Pill Shape */}
              <button
                className={`flex items-center justify-center w-full text-center py-5 rounded-full font-bold text-lg transition-all duration-500 ${text.length > 0 ? 'bg-white text-black scale-100' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                disabled={text.length === 0}
              >
                기록
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`flex items-center gap-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/archive"
              className="text-sm font-semibold tracking-wide opacity-40 hover:opacity-100 transition-opacity"
            >
              내 기록 보기
            </Link>
            <span className="opacity-20 text-xs">•</span>
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide opacity-40 hover:opacity-100 transition-opacity"
            >
              소개
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

