'use client';

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (provider: 'google' | 'credentials' = 'credentials') => {
        setIsLoading(true);
        try {
            await signIn(provider, {
                callbackUrl: "/write",
                redirect: true,
            });
        } catch (error) {
            console.error("Login failed:", error);
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="mobile-view">
                <div className="landing-container">
                    <div className="landing-content">
                        <h2 className="landing-title">
                            이제 당신의 이야기를<br />
                            시작해보세요.
                        </h2>
                    </div>

                    {/* Spacer reduced to bring buttons up */}
                    <div style={{ height: '50px', width: '100%' }}></div>

                    <div className="landing-content" style={{ marginTop: '20px', flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                        {/* Google Login Button */}
                        <button
                            onClick={() => handleLogin('google')}
                            disabled={isLoading}
                            className="premium-btn w-full max-w-[280px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isLoading ? '로그인 중...' : 'Google로 로그인하기'}</span>
                        </button>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', width: '280px', gap: '12px', margin: '8px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <span style={{ color: '#FFFFFF', fontSize: '12px', opacity: 0.8 }}>또는</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </div>

                        {/* Guest Login Button */}
                        <button
                            onClick={() => handleLogin('credentials')}
                            disabled={isLoading}
                            className="edit-btn w-full max-w-[280px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontSize: '15px' }}
                        >
                            <span>{isLoading ? '로그인 중...' : '손님으로 체험하기'}</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation & Tag */}
                <div className="landing-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link href="/" className="about-link" style={{ opacity: 0.5 }}>돌아가기</Link>
                        <span style={{ color: 'var(--text-secondary)', opacity: 0.3, fontSize: '10px' }}>•</span>
                        <Link href="/about" className="about-link" style={{ opacity: 0.5 }}>소개</Link>
                    </div>
                    <div className="bottom-tag">Human Text. 2026.</div>
                </div>
            </div>
        </div>
    );
}
