"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="app-container">
            <div className="mobile-view p-8 pt-16 overflow-y-auto">

                {/* Back Button */}
                <Link href="/" className="inline-block mb-12 text-sm font-semibold transition-colors hover:text-white" style={{ color: '#71717A' }}>
                    ← 홈으로
                </Link>

                {/* Header */}
                <div className={`mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">소개</h1>
                    <p className="text-xl leading-relaxed" style={{ color: '#A1A1AA' }}>
                        나를 마주하는 짧고 깊은 시간,<br />
                        <strong>오늘</strong>은 당신의 기록을 돕습니다.
                    </p>
                </div>

                {/* Vision Section */}
                <div className={`space-y-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <section>
                        <h2 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{ color: '#71717A' }}>우리의 가치</h2>
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                            <p className="text-lg leading-relaxed text-[#E4E4E7]">
                                바쁜 일상 속에서 잠시 멈춰 서서 내면의 목소리에 귀 기울이는 것.
                                그 찰나의 순간들이 모여 당신의 소중한 역사가 됩니다.
                                복잡한 기능보다는 <strong>기록 그 자체의 본질</strong>에 집중했습니다.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-bold mb-4 tracking-widest uppercase" style={{ color: '#71717A' }}>이용 방법</h2>
                        <ul className="space-y-4 text-[#A1A1AA]">
                            <li className="flex gap-4">
                                <span className="text-white font-bold">01.</span>
                                <span>매일 아침 배달되는 '오늘의 문장'을 읽어보세요.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-white font-bold">02.</span>
                                <span>그 문장에서 이어지는 당신만의 생각을 적어보세요.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-white font-bold">03.</span>
                                <span>쌓인 기록들은 '나의 기록'에서 언제든 다시 볼 수 있습니다.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <footer className="py-24 text-center">
                    <p className="text-[10px] opacity-30 mb-2" style={{ color: '#71717A' }}>
                        Human Text Publishing.
                    </p>
                    <p className="text-[10px] opacity-30 font-bold tracking-[0.3em]" style={{ color: '#71717A' }}>
                        SINCE 2026
                    </p>
                </footer>

            </div>
        </div>
    );
}
