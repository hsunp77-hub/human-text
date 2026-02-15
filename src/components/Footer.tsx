import Link from 'next/link';
import { useState, useEffect } from 'react';

interface FooterProps {
    pageContext?: 'sentences' | 'archive' | 'write' | 'about' | 'home' | 'social';
}

export default function Footer({ pageContext = 'home' }: FooterProps) {
    const [activeKey, setActiveKey] = useState(pageContext);

    // Sync activeKey if pageContext changes from parent (e.g. navigation complete)
    useEffect(() => {
        setActiveKey(pageContext);
    }, [pageContext]);

    const navItems: { key: NonNullable<FooterProps['pageContext']>, label: string, href: string }[] = [
        { key: 'social', label: '그날', href: '/social' },
        { key: 'sentences', label: '문장의 날짜', href: '/sentences' },
        { key: 'write', label: '글 쓰기', href: '/write' },
        { key: 'archive', label: '내 문장들', href: '/archive' },
        { key: 'about', label: '소개', href: '/about' },
    ];

    return (
        <footer className="py-12 flex flex-col items-center">
            <div className="footer-nav">
                {navItems.map((item, index) => (
                    <div key={item.key} className="flex items-center">
                        <Link
                            href={item.href}
                            onClick={() => setActiveKey(item.key)}
                            className={`nav-link ${activeKey === item.key ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                        {index < navItems.length - 1 && (
                            <span className="nav-dot mx-2">•</span>
                        )}
                    </div>
                ))}
            </div>
            <p className="footer-copyright">
                Human Text © 2026
            </p>
        </footer>
    );
}
