import { getPosts } from '@/lib/actions';
import { WongojiGrid } from './WongojiGrid';

export async function Feed() {
    const posts = await getPosts();

    if (posts.length === 0) {
        return (
            <div className="text-center py-20 text-muted">
                <p>아직 작성된 글이 없습니다.</p>
                <p className="text-sm mt-2">첫 번째 기록의 주인공이 되어보세요.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 mt-20">
            <h2 className="text-xl font-sans mb-8 text-center text-muted">다른 사람들의 생각</h2>
            <div className="space-y-8">
                {posts.map((post: any, index: number) => {
                    const pastelClasses = ['pastel-mint', 'pastel-blue', 'pastel-peach'];
                    const pastelClass = pastelClasses[index % pastelClasses.length];

                    return (
                        <article key={post.id} className={`pastel-card ${pastelClass}`}>
                            <WongojiGrid text={post.content} className="mb-4" />
                            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-sans uppercase tracking-widest mt-6 pt-4 border-t border-[rgba(0,0,0,0.05)]">
                                <span>
                                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                </span>
                                <div className="flex gap-4">
                                    <span>Like {post._count.likes}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
