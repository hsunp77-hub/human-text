"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="app-container">
            <div className="mobile-view p-8 pt-16 overflow-y-auto">

                {/* Unified Header */}
                <Header title="소개" />

                {/* Vision Section */}
                <div className={`space-y-12 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {/* Main Card */}
                    <div className="glass-card w-full p-8 relative flex flex-col items-start text-left mb-8 animate-fadeInUp">
                        <div className="w-full">

                            <div className="space-y-4">
                                <h2 className="about-title">
                                    우리의 가치
                                </h2>
                                <p className="about-text">
                                    우리 모두는 인생이라는 소설을 갖고 있습니다. 그날의 기억을 떠올려보세요. 그 찰나의 순간들이 모여서 당신의 소설이 됩니다. 복잡한 기능보다 기록과 연결의 그 자체의 본질에 집중했습니다.
                                </p>
                            </div>

                            {/* Explicit Spacer */}
                            <div style={{ height: '60px' }}></div>

                            {/* Section 2: How to Use */}
                            <div className="space-y-4">
                                <h2 className="about-title">
                                    이용방법
                                </h2>
                                <div className="about-list">
                                    <p>01. 매일 아침 배달되는 ‘그날의 문장’을 읽어보세요.</p>
                                    <p>02. 그 문장에서 이어지는 당신만의 인생 조각을 적어보세요.</p>
                                    <p>03. 쌓인 기록들은 '나의 기록'에서 언제든 다시 볼 수 있습니다.</p>
                                    <p>04. ’나의 기록’은 ‘나의 인생’, ‘나의 소설’이 됩니다.</p>
                                    <p>05. ‘그날의 문장’의 다른 사람의 인생도 읽어보세요.</p>
                                    <p>06. 우리는 각자의 인생이라는 소설을 살아갑니다.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Footer pageContext="about" />

            </div>
        </div>
    );
}
