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

        {/* Date - Top Right Alignment */}
        <div className="absolute top-10 right-10 text-sm font-semibold tracking-tight opacity-40 shrink-0">
          {today}
        </div>

        {/* Main Section - All Centered Vertical Flow */}
        <div className={`w-full flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Title Area */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 tracking-tighter">
              오늘
            </h1>
            <p className="text-xl font-medium tracking-tight opacity-60">
              당신의 인생의 한 순간을 떠올려보세요.
            </p>
          </div>

          {/* Writing Flow Section */}
          <div className="w-full max-w-sm flex flex-col items-center mb-16">
            <div className="w-full text-center">
              {/* Reference Text - Integrated Design */}
              <div className="text-2xl leading-relaxed mb-4 font-medium opacity-80">
                창문을 여니 햇살이 소나기처럼 쏟아진다.
              </div>

              {/* Textarea - Borderless, Integrated cursor moving feel */}
              <div className="relative w-full">
                <textarea
                  className="w-full bg-transparent border-none text-white text-2xl leading-relaxed resize-none outline-none font-hand text-center placeholder:text-white/20"
                  value={text}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) setText(e.target.value);
                  }}
                  placeholder="두번째 문장을 기다리고 있어요"
                  spellCheck={false}
                  rows={4}
                  autoFocus
                />
              </div>
            </div>

            {/* Record Button - Centered with Fountain Pen Icon */}
            <button
              className={`mt-10 flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-500 ${text.length > 0 ? 'bg-white text-black scale-100' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
              disabled={text.length === 0}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m11 4 4 4-10.5 10.5c-.77.77-2.36 1-3 .5s-.27-2.23.5-3Z" />
                <path d="m11 4 7-2 4 4-2 7Z" />
                <path d="m15 8 4 4" />
              </svg>
              기록
            </button>
          </div>

          {/* Footer - Centered */}
          <div className="flex items-center gap-4 opacity-40">
            <Link
              href="/archive"
              className="text-sm font-semibold tracking-wide hover:opacity-100 transition-opacity"
            >
              내 기록 보기
            </Link>
            <span className="text-xs opacity-40 text-white select-none">•</span>
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide hover:opacity-100 transition-opacity"
            >
              소개
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
