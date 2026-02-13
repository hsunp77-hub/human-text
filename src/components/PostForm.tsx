'use client';

import { useState, useEffect, useRef } from 'react';
import { createPost } from '@/lib/actions';

interface PostFormProps {
    sentenceId: string;
    onPostSuccess?: () => void;
}

export function PostForm({ sentenceId, onPostSuccess }: PostFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authorId, setAuthorId] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        let storedId = localStorage.getItem('human_text_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('human_text_id', storedId);
        }
        setAuthorId(storedId);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || content.length > 500) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('content', content);
        formData.append('sentenceId', sentenceId);
        formData.append('authorId', authorId);

        const result = await createPost(formData);

        setIsSubmitting(false);
        if (result?.success) {
            setContent('');
            if (onPostSuccess) onPostSuccess();
            alert('소중한 글이 기록되었습니다.');
        } else {
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-20">
            {/* Input Label */}
            <div className="mb-2 text-xs text-[var(--accent)] tracking-widest pl-1">
                작성하기 ({content.length} / 500)
            </div>

            {/* Grid Input Area */}
            <div className="wongoji-input-container mb-8">
                <textarea
                    ref={textareaRef}
                    className="wongoji-textarea"
                    placeholder="첫 문장을 이어받아..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                    rows={10}
                    disabled={isSubmitting}
                    spellCheck={false}
                />
            </div>

            <div className="text-center">
                <button
                    type="submit"
                    disabled={isSubmitting || content.length === 0}
                    className="btn px-8 py-2 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? '기록 중...' : '기록하기'}
                </button>
            </div>
        </form>
    );
}
