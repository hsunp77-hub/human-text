'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/lib/actions';

export default function SignupPinPage() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem('human_text_id');
        setUserId(storedId);
    }, []);

    const handleNumberClick = (num: number) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleComplete = async (skip = false) => {
        if (!userId) return;
        setLoading(true);

        const data: any = { isSignupCompleted: true };
        if (!skip && pin.length === 6) {
            data.pin = pin;
        }

        const result = await updateUserProfile(userId, data);
        if (result.success) {
            router.push('/settings');
        } else {
            alert(result.error || '오류가 발생했습니다.');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (pin.length === 6) {
            handleComplete(false);
        }
    }, [pin]);

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
                        font-family: inherit !important;
                        font-size: 26px !important;
                        font-weight: 700 !important;
                        line-height: 1.5 !important;
                        letter-spacing: -0.02em !important;
                        margin-bottom: 40px !important;
                    }
                    .pin-keyboard-btn {
                        font-family: inherit !important;
                        font-size: 32px !important;
                        font-weight: 700 !important;
                        height: 80px !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.1s ease;
                        outline: none !important;
                        background: transparent;
                        border: none;
                        color: #FFFFFF;
                        cursor: pointer;
                    }
                    .pin-keyboard-btn:active {
                        transform: scale(0.9);
                        opacity: 0.5;
                    }
                    .btn-standard {
                        font-family: inherit !important;
                        background: #3F3F3F !important;
                        color: #FFFFFF !important;
                        border-radius: 4px !important;
                        font-size: 19px !important;
                        font-weight: 700 !important;
                        height: 60px !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        border: none !important;
                        padding: 0 50px !important;
                        min-width: 160px;
                    }
                    .pin-marker {
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 40px;
                        color: #525252;
                        transition: all 0.2s ease;
                        line-height: 1;
                    }
                    .pin-marker.filled {
                        color: #FFFFFF;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
                        transform: scale(1.1);
                    }
                    .delete-btn-text {
                        font-size: 12px !important;
                        font-weight: 500 !important;
                        opacity: 0.6 !important;
                    }
                `}</style>

                <header>
                    <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', padding: 0, marginBottom: '48px', color: '#71717A', display: 'flex', alignItems: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h1 className="header-title">
                        비밀번호를 등록하여<br />
                        계정을 보호하세요.
                    </h1>
                </header>

                <main className="flex-1 flex flex-col items-center">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '80px', marginTop: '32px', justifyContent: 'center', width: '100%' }}>
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`pin-marker ${pin.length > i ? 'filled' : ''}`}
                            >
                                {pin.length > i ? '*' : '·'}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '300px' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num)}
                                className="pin-keyboard-btn"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="pin-keyboard-btn"></div>
                        <button
                            onClick={() => handleNumberClick(0)}
                            className="pin-keyboard-btn"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="pin-keyboard-btn"
                        >
                            <span className="delete-btn-text">지우기</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
