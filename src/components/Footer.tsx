import Link from 'next/link';

interface FooterProps {
    pageContext?: 'sentences' | 'archive' | 'write' | 'about' | 'home';
}

export default function Footer({ pageContext = 'home' }: FooterProps) {
    const leftLink = pageContext === 'sentences'
        ? { label: '내 문장들', href: '/archive' }
        : { label: '문장의 날짜', href: '/sentences' };

    const centerLink = (pageContext === 'sentences' || pageContext === 'archive')
        ? { label: '글 쓰기', href: '/write' }
        : { label: '내 문장들', href: '/archive' };

    return (
        <footer className="py-12 flex flex-col items-center">
            <div className="footer-nav">
                <Link href={leftLink.href}>{leftLink.label}</Link>
                <span className="nav-dot">•</span>
                <Link href={centerLink.href}>{centerLink.label}</Link>
                <span className="nav-dot">•</span>
                <Link href="/about">소개</Link>
            </div>
            <p className="footer-copyright">
                Human Text © 2026
            </p>
        </footer>
    );
}
