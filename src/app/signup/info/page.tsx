'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/lib/actions';

export default function SignupInfoPage() {
    const router = useRouter();
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem('human_text_id');
        setUserId(storedId);
    }, []);

    const handleComplete = async (skip = false) => {
        if (!userId) return;
        setLoading(true);

        const data: any = {};
        if (!skip) {
            if (birthday) {
                const dateParts = birthday.split('.');
                if (dateParts.length === 3) {
                    data.birthday = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T00:00:00Z`);
                }
            }
            if (gender) data.gender = gender;
        }

        const result = await updateUserProfile(userId, data);
        if (result.success) {
            router.push('/signup/pin');
        } else {
            alert(result.error || '오류가 발생했습니다.');
        }
        setLoading(false);
    };

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
                    .header-title {
                        font-size: 26px !important;
                        font-weight: 700 !important;
                        line-height: 1.5 !important;
                        letter-spacing: -0.02em !important;
                        margin-bottom: 40px !important;
                    }
                    .input-label {
                        font-size: 19px !important;
                        font-weight: 700 !important;
                        color: #FFFFFF !important;
                        margin-bottom: 8px !important;
                    }
                    .styled-input-line {
                        background: transparent !important;
                        border: none !important;
                        border-bottom: 2.5px solid #2D2D2D !important;
                        color: #FFFFFF !important;
                        font-family: inherit !important;
                        font-size: 24px !important;
                        font-weight: 700 !important;
                        padding: 12px 0 !important;
                        width: 100% !important;
                        outline: none !important;
                        border-radius: 0 !important;
                    }
                    .btn-half {
                        background: #3F3F3F !important;
                        color: #FFFFFF !important;
                        border-radius: 4px !important;
                        font-size: 19px !important;
                        font-weight: 700 !important;
                        height: 60px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        border: none !important;
                        width: 50% !important;
                    }
                    .gender-item {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: center !important;
                        gap: 12px !important;
                        background: transparent !important;
                        border: none !important;
                        outline: none !important;
                        padding: 0 !important;
                    }
                    .gender-dot {
                        width: 30px !important;
                        height: 30px !important;
                        border: 2px solid #525252 !important;
                        border-radius: 50% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        flex-shrink: 0 !important;
                    }
                    .gender-item.active .gender-dot {
                        border-color: #FFFFFF !important;
                    }
                    .gender-dot-inner {
                        width: 16px !important;
                        height: 16px !important;
                        border-radius: 50% !important;
                        background: transparent !important;
                    }
                    .gender-item.active .gender-dot-inner {
                        background: #FFFFFF !important;
                    }
                    .gender-text {
                        color: #FFFFFF !important;
                        font-size: 20px !important;
                        font-weight: 500 !important;
                    }
                `}</style>

                <header>
                    <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', padding: 0, marginBottom: '48px', color: '#71717A', display: 'flex', alignItems: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h1 className="header-title">
                        저자에 대해서<br />
                        조금 더 알려주세요.
                    </h1>
                </header>

                <main style={{ flex: 1 }}>
                    {/* Birthday */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '70px' }}> {/* Reduced gap from 140px to 70px (1/2) */}
                        <label className="input-label">생년월일 (선택)</label>
                        <input
                            type="text"
                            value={birthday}
                            onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9.]/g, '');
                                if (val.length === 4 && !val.includes('.')) val += '.';
                                if (val.length === 7 && val.split('.').length === 2) val += '.';
                                setBirthday(val.slice(0, 10));
                            }}
                            placeholder="2000.00.00"
                            className="styled-input-line placeholder:opacity-20"
                        />
                    </div>

                    {/* Gender Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '80px' }}>
                        <label className="input-label">성별 (선택)</label>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', marginTop: '12px' }}>
                            {['여성', '남성', '그외'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`gender-item ${gender === g ? 'active' : ''}`}
                                >
                                    <div className="gender-dot">
                                        <div className="gender-dot-inner"></div>
                                    </div>
                                    <span className="gender-text">{g}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                <footer style={{ marginTop: 'auto' }}>
                    {/* Privacy Agreement */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer', marginBottom: '56px' }} onClick={() => setPrivacyAgreed(!privacyAgreed)}>
                        <div style={{ width: '26px', height: '26px', border: '2px solid #FFFFFF', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {privacyAgreed && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            )}
                        </div>
                        <div className="select-none">
                            <p style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>개인정보 수집 및 동의 (선택)</p>
                            <p style={{ fontSize: '13px', color: '#A1A1AA', marginTop: '8px', lineHeight: '1.5' }}>
                                부가서비스 이용을 위한 개인정보 추가 수집에 동의합니다. <span style={{ color: '#C5A17A', textDecoration: 'underline' }}>전문보기</span>
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                        <button
                            onClick={() => handleComplete(true)}
                            className="btn-half"
                        >
                            건너뛰기
                        </button>
                        <button
                            onClick={() => handleComplete(false)}
                            disabled={loading || !privacyAgreed}
                            className="btn-half"
                            style={{ backgroundColor: '#4A4A4A', color: '#FFFFFF' }}
                        >
                            {loading ? '처리 중...' : '완료'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
