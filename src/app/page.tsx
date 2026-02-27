"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="app-container">
      <div className="mobile-view">
        <div className="landing-container">
          <div className="landing-content">
            <h2 className="landing-title !text-[var(--text-primary)]">
              당신 인생의 한순간을<br />
              떠올려주세요.
            </h2>
          </div>

          <div className="sphere-cluster">
            {/* SVG Connectors */}
            <svg className="connector-svg" viewBox="0 0 300 300">
              <line className="connector-line" x1="60" y1="60" x2="65" y2="230" />
              <line className="connector-line" x1="60" y1="60" x2="245" y2="75" />
              <line className="connector-line" x1="245" y1="75" x2="255" y2="240" />
              <line className="connector-line" x1="65" y1="230" x2="255" y2="240" />
            </svg>

            <div className="sphere sphere-sage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sphere-icon">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div className="sphere sphere-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sphere-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="sphere sphere-peach">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sphere-icon">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div className="sphere sphere-rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sphere-icon">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
          </div>

          <div className="landing-content" style={{ marginTop: '20px', flex: 'none' }}>
            <button
              className="premium-btn warm-gradient w-full max-w-[200px]"
              onClick={() => router.push("/login")}
            >
              기록의 시작
            </button>
          </div>
        </div>

        {/* Bottom Navigation & Tag */}
        <div className="landing-footer">
          <Link href="/about" className="about-link !text-[var(--text-secondary)]">소개</Link>
          <div className="bottom-tag !text-[var(--text-muted)]">Human Text. 2026.</div>
        </div>
      </div>
    </div>
  );
}
