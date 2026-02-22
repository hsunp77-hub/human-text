'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserProfile, updateUserProfile } from '@/lib/actions';

export default function SettingsPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getByteLength = (str: string) => new TextEncoder().encode(str).length;
    const bioBytes = getByteLength(bio);

    useEffect(() => {
        const storedId = localStorage.getItem('human_text_id');
        if (!storedId) {
            router.push('/login');
            return;
        }
        setUserId(storedId);

        const fetchProfile = async () => {
            const profile = await getUserProfile(storedId);
            if (profile) {
                setName(profile.name || '');
                setBio(profile.bio || '');
                setImage(profile.image || null);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('이미지 크기는 2MB를 초과할 수 없습니다.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveField = async (field: 'bio' | 'image' | 'all') => {
        if (!userId) return;
        setError(null);

        if (field === 'bio' || field === 'all') {
            if (bioBytes > 100) {
                setError('소개글은 100byte를 초과할 수 없습니다.');
                return;
            }
        }

        setSaving(field);
        try {
            const updateData: any = {};
            if (field === 'all') {
                updateData.bio = bio;
                updateData.image = image || undefined;
            } else if (field === 'image') {
                updateData.image = image || undefined;
            } else {
                updateData.bio = bio;
            }

            const result = await updateUserProfile(userId, updateData);
            if (result.success) {
                if (field === 'all') {
                    router.push(`/user/${userId}`);
                } else {
                    alert('변경사항이 저장되었습니다.');
                }
            } else {
                setError(result.error || '저장 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(null);
        }
    };

    const customStyles = `
        .settings-container {
            padding: 64px 40px 48px 40px !important;
            background-color: #000000 !important;
            color: #FFFFFF !important;
            min-height: 100vh !important;
        }
        .header-title {
            font-size: 26px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;
            letter-spacing: -0.02em !important;
            margin-bottom: 60px !important;
            color: #FFFFFF !important;
        }
        .label-style {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #FFFFFF !important;
            margin-bottom: 12px !important;
            display: block !important;
        }
        .info-value-box {
            background-color: transparent !important;
            border-bottom: 2px solid #262626 !important;
            color: #FFFFFF !important;
            font-size: 20px !important;
            font-weight: 500 !important;
            padding: 12px 0 !important;
            flex: 1 !important;
        }
        .photo-area {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #1A1A1A;
            border: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
        }
        .photo-upload-btn-small {
            background-color: #262626 !important;
            color: #A1A1AA !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            border: none !important;
            cursor: pointer !important;
            height: fit-content !important;
        }
        .bio-textarea {
            background-color: #1A1A1A !important;
            border: 1px solid #333 !important;
            border-radius: 8px !important;
            color: #FFFFFF !important;
            width: 100% !important;
            padding: 16px !important;
            font-size: 16px !important;
            min-height: 140px !important;
            resize: none !important;
            outline: none !important;
            margin-bottom: 12px !important;
        }
        .small-action-btn {
            background-color: #262626 !important;
            color: #A1A1AA !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            padding: 6px 14px !important;
            border-radius: 4px !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }
        .small-action-btn:hover {
            background-color: #333 !important;
            color: #FFFFFF !important;
        }
        .global-save-btn {
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
            margin-top: 32px !important;
            cursor: pointer !important;
        }
        .global-save-btn:disabled {
            opacity: 0.25 !important;
        }
    `;

    if (loading) {
        return (
            <div className="mobile-view bg-black flex items-center justify-center min-h-screen">
                <div className="text-[#71717A] animate-pulse">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <style>{customStyles}</style>
            <div className="mobile-view settings-container no-scrollbar">
                <Header title="저자를 설정해주세요." className="header-title" />

                <main className="w-full flex-1 pb-40">
                    {/* 1. Photo Section - Horizontal Layout with Inline Styles */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', marginBottom: '80px' }}>
                        <div className="photo-area" onClick={() => fileInputRef.current?.click()}>
                            {image ? (
                                <img src={image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[#333] text-4xl">+</div>
                            )}
                        </div>
                        <button
                            className="photo-upload-btn-small"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            사진 업로드
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    {/* 2. Author ID Section - Increased Spacing & Modify Button */}
                    <div className="mb-12 text-left">
                        <label className="label-style">저자 아이디</label>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '16px' }}>
                            <div className="info-value-box">
                                {name || '아이디 정보 없음'}
                            </div>
                            <button className="small-action-btn" style={{ marginBottom: '8px' }}>
                                수정
                            </button>
                        </div>
                    </div>

                    {/* 3. Bio Section - Separate Small Buttons */}
                    <div className="mb-10 text-left">
                        <label className="label-style">소개글</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="자신을 소개하는 글을 남겨주세요."
                            className="bio-textarea"
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                className="small-action-btn"
                                onClick={() => handleSaveField('bio')}
                                disabled={saving === 'bio'}
                            >
                                {saving === 'bio' ? '저장 중...' : '저장'}
                            </button>
                            <button
                                className="small-action-btn"
                                onClick={() => {/* Handle modify if needed, currently behaves same as save or enables edit mode */ }}
                            >
                                수정
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {/* 4. Global Save Button */}
                    <button
                        className="global-save-btn"
                        onClick={() => handleSaveField('all')}
                        disabled={saving === 'all'}
                    >
                        {saving === 'all' ? '저장 중...' : '전체 프로필 저장하기'}
                    </button>
                    <div className="flex justify-center mt-4 pb-8">
                        <button
                            onClick={() => router.push(`/user/${userId}`)}
                            className="text-[#525252] text-sm underline bg-transparent border-none cursor-pointer p-2 hover:text-[#A1A1AA] transition-colors"
                        >
                            다음에 하기
                        </button>
                    </div>
                </main>

                <Footer pageContext="others" />
            </div>
        </div>
    );
}
