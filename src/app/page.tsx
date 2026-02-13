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

        {/* Date at Top Right */}
        <div className="absolute top-6 right-6 text-sm font-semibold" style={{ color: '#71717A' }}>
          {today}
        </div>

        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center h-full px-8">

          {/* Logo/Title Area */}
          <div className={`text-center mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl font-bold mb-4 tracking-tight" style={{ color: '#FFFFFF' }}>
              오늘
            </h1>
            <p className="text-lg" style={{ color: '#A1A1AA' }}>
              당신의 인생의 한 순간을 떠올려보세요.
            </p>
          </div>

          {/* Today's Sentence Card */}
          <div className={`w-full max-w-md mb-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <p className="text-xs font-semibold mb-3 tracking-wider" style={{ color: '#71717A' }}>
                오늘의 문장
              </p>
              <p className="text-xl leading-relaxed mb-6" style={{ color: '#E4E4E7' }}>
                창문을 여니 햇살이 소나기처럼 쏟아졌다.
              </p>

              {/* Writing Area */}
              <div className="relative mb-6">
                <textarea
                  className="w-full bg-black/20 border-none rounded-xl p-4 text-[#FFFFFF] text-lg leading-relaxed resize-none outline-none min-h-[160px] font-hand"
                  value={text}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                  }}
                  placeholder="두번째 문장이 기다리고 있어요..."
                  spellCheck={false}
                  rows={5}
                />
                <div className="absolute bottom-2 right-4 text-xs opacity-20" style={{ color: '#71717A' }}>
                  {text.length} / {MAX_CHARS}
                </div>
              </div>

              {/* Record Button */}
              <button
                className={`flex items-center justify-center gap-2 w-full text-center py-4 rounded-full font-semibold text-base transition-all ${text.length > 0 ? 'bg-white text-black hover:bg-white/90 hover:scale-[1.02]' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                disabled={text.length === 0}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                기록
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`flex gap-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/archive"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#71717A' }}
            >
              내 기록 보기
            </Link>
            <span style={{ color: '#3F3F46' }}>•</span>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: '#71717A' }}
            >
              소개
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs opacity-30" style={{ color: '#71717A' }}>
            Human Text. 2026.
          </p>
        </div>

      </div>
    </div>
  );
}

