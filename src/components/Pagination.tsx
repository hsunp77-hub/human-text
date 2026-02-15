import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string; // Allow minimal overrides or margin handling
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`pagination-container ${className}`} style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: currentPage === pageNum ? 'white' : 'transparent',
                        color: currentPage === pageNum ? 'black' : '#71717A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: currentPage === pageNum ? 600 : 400,
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {pageNum}
                </button>
            ))}
        </div>
    );
}
