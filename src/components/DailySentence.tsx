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
            <div className="text-xs text-[var(--accent)] mb-2 tracking-widest opacity-80 text-right px-2">
                {formattedDate}
            </div>

            <WongojiGrid text={content} className="shadow-sm" />
        </section>
    );
}
