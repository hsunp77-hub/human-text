"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { createPost, getTodaySentence } from "@/lib/actions";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("");
  const [sentence, setSentence] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const prompt = "창문을 여니 햇살이 소나기처럼 쏟아졌다.";
  const MAX_CHARS = 500;

  // Get current date
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    setMounted(true);

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

  const handleRecord = async () => {
    if (text.trim() && sentence && userId) {
      const formData = new FormData();
      formData.append('content', text.trim());
      formData.append('authorId', userId);
      formData.append('sentenceId', sentence.id);

      const result = await createPost(formData);
      if (result.success) {
        setText("");
        // Redirect or show success
      }
    }
  };

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
            <p className="subtitle">당신 인생의 한순간을 떠올려보세요.</p>
          </div>

          {/* Writing Card Section */}
          <div className="glass-card">
            <div className="card-label">오늘의 문장</div>
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

            {/* Record Button - No Icon, Matching Preview Style */}
            <button
              className={`record-btn ${text.trim().length > 0 ? 'btn-active' : 'btn-disabled'}`}
              disabled={text.trim().length === 0}
              onClick={handleRecord}
            >
              기록
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="footer-nav">
            <Link href="/archive">나의 문장들</Link>
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
