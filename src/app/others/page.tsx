'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { DAILY_PROMPTS } from '@/lib/sentences';

// Mock User Data from user profile page
const MOCK_USERS = [
    {
        id: 'user_summer',
        name: 'user_summer',
        bio: '여름의 조각들을 문장으로 담아내는 사람입니다. 소소한 일상과 계절의 변화를 기록하며 살아갑니다.',
        image: '/user_summer_profile.png',
        postCount: 3,
        latestPost: {
            content: '계절이 바뀌는 냄새는 늘 그리운 사람을 먼저 데려온다.',
            createdAt: new Date('2026-02-15'),
            sentence: DAILY_PROMPTS[0]
        }
    },
    {
        id: 'user_spring',
        name: 'user_spring',
        bio: '새로운 시작과 희망의 계절, 봄을 사랑하는 작가입니다. 피어나는 꽃처럼 매일 새로운 이야기를 만들어갑니다.',
        image: '/user_spring_profile.png',
        postCount: 3,
        latestPost: {
            content: '책임이라는 옷은 생각보다 얇고, 겨울 새벽은 너무나 길었다.',
            createdAt: new Date('2026-02-15'),
            sentence: DAILY_PROMPTS[13]
        }
    },
    {
        id: 'user_autumn',
        name: 'user_autumn',
        bio: '가을의 쓸쓸함 속에서 아름다움을 찾는 사람입니다. 낙엽처럼 조용히 내려앉는 생각들을 글로 남깁니다.',
        image: '/user_autumn_profile.png',
        postCount: 3,
        latestPost: {
            content: '참아왔던 눈물은 노을보다 더 짙게 마음을 적셨다.',
            createdAt: new Date('2026-02-15'),
            sentence: DAILY_PROMPTS[8]
        }
    },
    {
        id: 'user_winter',
        name: 'user_winter',
        bio: '고요한 겨울의 순간들을 담아냅니다. 차가운 공기 속에서 더욱 선명해지는 감정들을 기록합니다.',
        image: '/user_winter_profile.png',
        postCount: 3,
        latestPost: {
            content: '어둠은 때로 가장 선명한 글씨체가 된다.',
            createdAt: new Date('2026-02-15'),
            sentence: DAILY_PROMPTS[9]
        }
    }
];

const formatDisplayId = (userId: string) => userId;

export default function OthersPage() {
    return (
        <div className="app-container">
            <div className="mobile-view archive-view px-6">
                <Header title="타인의 문장들" className="!mb-[80px]" />

                <main className="w-full flex-1 overflow-y-auto pb-10 no-scrollbar">
                    <div className="space-y-6">
                        {MOCK_USERS.map((user) => (
                            <Link key={user.id} href={`/user/${user.id}`}>
                                <article className="archive-card">
                                    <div className="archive-card-date">
                                        {user.latestPost.createdAt.toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="archive-card-merged-text">
                                        <span style={{ fontWeight: 600 }}>{user.latestPost.sentence}</span>
                                        <span> {user.latestPost.content}</span>
                                    </div>
                                    <div className="archive-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {/* User ID with profile image on the left */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                backgroundColor: '#27272a',
                                                flexShrink: 0
                                            }}>
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#52525b',
                                                        fontSize: '8px'
                                                    }}>
                                                        {user.id.substring(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#71717A', fontFamily: 'serif', letterSpacing: '0.5px' }}>
                                                {formatDisplayId(user.id)}
                                            </div>
                                        </div>

                                        {/* Action buttons on the right */}
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="action-btn">
                                                <span className="mr-1">♥</span>
                                                LIKE 0
                                            </button>
                                            <button className="action-btn">
                                                <span className="mr-1">💬</span>
                                                COMMENT 0
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </main>

                <Footer pageContext="others" />
            </div>
        </div>
    );
}
