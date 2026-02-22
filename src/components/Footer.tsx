'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FooterProps {
    pageContext?: 'archive' | 'write' | 'about' | 'home' | 'social' | 'others';
}

export default function Footer({ pageContext = 'home' }: FooterProps) {
    const [activeKey, setActiveKey] = useState(pageContext);

    // Sync activeKey if pageContext changes from parent (e.g. navigation complete)
    useEffect(() => {
        setActiveKey(pageContext);
    }, [pageContext]);

    const navItems: { key: NonNullable<FooterProps['pageContext']>, label: string, href: string, icon: React.ReactNode }[] = [
        {
            key: 'social',
            label: '그날',
            href: '/social',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
            )
        },
        {
            key: 'others',
            label: '타인의 문장들',
            href: '/others',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        },
        {
            key: 'write',
            label: '글 쓰기',
            href: '/write',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l5 5"></path>
                    <path d="M11 11l1 1"></path>
                </svg>
            )
        },
        {
            key: 'archive',
            label: '내 문장들',
            href: '/archive',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
            )
        },
    ];

    return (
        <footer className="footer-nav-container">
            <div className="footer-nav-icons">
                {navItems.map((item) => (
                    <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setActiveKey(item.key)}
                        className={`nav-icon-link ${activeKey === item.key ? 'active' : ''}`}
                        aria-label={item.label}
                    >
                        {item.icon}
                    </Link>
                ))}
            </div>
            <p className="footer-copyright">
                Human Text © 2026
            </p>
        </footer>
    );
}
