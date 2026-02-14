import { useRouter } from "next/navigation";

interface HeaderProps {
    title: string;
    label?: string;
}

export default function Header({ title, label }: HeaderProps) {
    const router = useRouter();

    return (
        <header className="unified-header">
            <div className="unified-header-top">
                <button
                    onClick={() => router.push("/")}
                    className="unified-header-icon"
                    aria-label="홈으로"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
                <button
                    className="unified-header-icon"
                    aria-label="설정"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m8.66-15.66l-4.24 4.24m-4.24 4.24l-4.24 4.24M23 12h-6m-6 0H1m15.66 8.66l-4.24-4.24m-4.24-4.24l-4.24-4.24"></path>
                    </svg>
                </button>
            </div>
            {label && (
                <div className="header-label">
                    {label}
                </div>
            )}
            <h1 className="unified-header-title">{title}</h1>
        </header>
    );
}
