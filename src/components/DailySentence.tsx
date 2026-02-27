import React from 'react';
import { WongojiGrid } from './WongojiGrid';

interface DailySentenceProps {
    content: string;
    date: Date;
}

export function DailySentence({ content, date }: DailySentenceProps) {
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).format(date);

    return (
        <section className="animate-fade-in mb-10">
            <div className="text-xs text-[var(--text-secondary)] mb-4 tracking-widest opacity-80 text-right px-2 font-sans uppercase">
                {formattedDate}
            </div>

            <div className="pastel-card pastel-blue !mb-0">
                <WongojiGrid text={content} />
            </div>
        </section>
    );
}
