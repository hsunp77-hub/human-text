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
            <h2 className="landing-title">
              당신 인생의 한순간을<br />
              떠올려주세요.
            </h2>
          </div>

          <div className="nib-container">
            <Image
              src="/nib.png"
              alt="Fountain Pen Nib"
              width={180}
              height={300}
              className="nib-img"
              priority
            />
          </div>

          <div className="landing-content" style={{ marginTop: '20px', flex: 'none' }}>
            <button
              className="premium-btn w-full max-w-[200px]"
              onClick={() => router.push("/login")}
            >
              기록의 시작
            </button>
          </div>
        </div>

        {/* Bottom Navigation & Tag */}
        <div className="landing-footer">
          <Link href="/about" className="about-link">소개</Link>
          <div className="bottom-tag">Human Text. 2026.</div>
        </div>
      </div>
    </div>
  );
}
