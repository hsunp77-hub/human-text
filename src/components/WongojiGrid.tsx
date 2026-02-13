import React from 'react';

interface WongojiGridProps {
    text: string;
    className?: string;
}

export function WongojiGrid({ text, className = "" }: WongojiGridProps) {
    // Split text into characters.
    // Note: True Won-go-ji ignores newlines often or treats them as skip cells, 
    // but for readability we should probably honor strict wrapping or just render continuous stream.
    // Let's go with continuous stream for the "box" feel, but maybe handle paragraphs if needed.
    // For MVP "emotional" feel, continuous cells are very "manuscript-like".

    const chars = text.split('');

    return (
        <div className={`wongoji-display-container ${className}`}>
            <div className="border-t border-[var(--manuscript-red)] border-l border-[var(--manuscript-red)] flex flex-wrap w-full bg-[var(--background)]">
                {chars.map((char, index) => (
                    <div
                        key={index}
                        className="wongoji-cell border-r border-b border-[var(--manuscript-red)] flex items-center justify-center text-[18px] font-serif text-[var(--foreground)] w-[32px] h-[32px]"
                    >
                        {char === '\n' ? <span className="opacity-20">↵</span> : char}
                    </div>
                ))}
                {/* Fill the rest of the line or add empty cells? 
            For now, just the text cells is cleaner for variable length posts. 
            Maybe add a generic end-of-text marker? */}
                <div className="wongoji-cell border-r border-b border-[var(--manuscript-red)]"></div>
                <div className="wongoji-cell border-r border-b border-[var(--manuscript-red)]"></div>
                <div className="wongoji-cell border-r border-b border-[var(--manuscript-red)]"></div>
            </div>
        </div>
    );
}
