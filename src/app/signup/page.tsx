'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUsernameUnique, updateUserProfile } from '@/lib/actions';

export default function SignupPage() {
    const router = useRouter();
    const [nickname, setNickname] = useState('');
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem('human_text_id');
        setUserId(storedId);
    }, []);

    const checkNickname = async () => {
        if (!nickname.trim()) return;
        setLoading(true);
        const unique = await isUsernameUnique(nickname);
        setIsUnique(unique);
        setLoading(false);
    };

    const handleNext = async () => {
        if (!isUnique || !termsAgreed || !userId) return;

        setLoading(true);
        const result = await updateUserProfile(userId, { name: nickname });
        if (result.success) {
            router.push('/signup/info');
        } else {
            alert(result.error || '오류가 발생했습니다.');
        }
        setLoading(false);
    };

    const getByteLength = (str: string) => new TextEncoder().encode(str).length;
    const nicknameBytes = getByteLength(nickname);

    return (
        <div className="app-container">
            <div className="mobile-view" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '64px 40px 48px 40px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                minHeight: '100vh',
                boxSizing: 'border-box'
            }}>
                <style>{`
                    .signup-header {
                        font-size: 26px !important;
                        font-weight: 700 !important;
                        line-height: 1.5 !important;
                        letter-spacing: -0.02em !important;
                        margin-bottom: 40px !important;
                    }
                    .custom-input-line {
                        background: transparent !important;
                        border: none !important;
                        border-bottom: 2px solid #FFFFFF !important;
                        color: #FFFFFF !important;
                        font-family: inherit !important;
                        font-size: 24px !important;
                        font-weight: 700 !important;
                        padding: 12px 0 8px 0 !important;
                        width: 100% !important;
                        outline: none !important;
                        border-radius: 0 !important;
                    }
                    .check-btn-v2 {
                        background: #4A4A4A !important;
                        color: #B0B0B0 !important;
                        border-radius: 4px !important;
                        font-size: 15px !important;
                        padding: 0 20px !important;
                        height: 50px !important;
                        font-weight: 600 !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        white-space: nowrap !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                    .next-btn-full-v2 {
                        background: #4A4A4A !important;
                        color: #FFFFFF !important;
                        width: 100% !important;
                        height: 64px !important;
                        border-radius: 4px !important;
                        font-size: 20px !important;
                        font-weight: 700 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        border: 1px solid rgba(255, 255, 255, 0.05) !important;
                        margin-top: 32px;
                    }
                    .next-btn-full-v2:disabled {
                        opacity: 0.25;
                    }
                    .terms-container {
                        margin-top: auto;
                        padding-bottom: 20px;
                    }
                `}</style>

                <header>
                    <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', padding: 0, marginBottom: '48px', color: '#71717A', display: 'flex', alignItems: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h1 className="signup-header">
                        환영합니다.<br />
                        저자의 이름을 알려주세요.
                    </h1>
                </header>

                <main className="flex flex-col">
                    <div className="flex flex-col">
                        <label className="text-[19px] font-bold mb-6 opacity-95">저자의 이름</label>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', width: '100%' }}>
                            <div style={{ width: '72%' }}>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value);
                                        setIsUnique(null);
                                    }}
                                    className="custom-input-line"
                                    autoComplete="off"
                                    placeholder=""
                                />
                            </div>
                            <button
                                onClick={checkNickname}
                                disabled={!nickname.trim() || loading}
                                className="check-btn-v2"
                                style={{ marginBottom: '4px' }}
                            >
                                중복확인
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
                            <div className="min-h-[22px]">
                                {isUnique === true && <span className="text-[#A1A1AA] text-[14px]">사용할 수 있는 이름입니다.</span>}
                                {isUnique === false && <span className="text-red-400 text-[14px]">이미 사용 중인 이름입니다.</span>}
                            </div>
                            <span className="text-[14px] text-[#8B8B8B]" style={{ paddingRight: '20px' }}>{nicknameBytes}/10byte</span>
                        </div>
                    </div>
                </main>

                <footer className="terms-container">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', marginBottom: '20px' }} onClick={() => setTermsAgreed(!termsAgreed)}>
                        <div style={{
                            width: '22px',
                            height: '22px',
                            border: '1.5px solid #FFFFFF',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                        }}>
                            {termsAgreed && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                        <div className="select-none">
                            <p className="text-[16px] font-bold">회원가입 및 이용약관에 동의합니다.</p>
                            <p className="text-[12px] text-[#A1A1AA] mt-2 leading-relaxed">
                                회원가입 정보 수집 및 제공된 이용약관에 동의합니다. <span style={{ color: '#C5A17A', textDecoration: 'underline' }} className="cursor-pointer ml-1">전문보기</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!isUnique || !termsAgreed || loading}
                        className="next-btn-full-v2"
                    >
                        {loading ? '처리 중...' : '다음'}
                    </button>
                </footer>
            </div>
        </div>
    );
}
