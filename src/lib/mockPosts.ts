import { DAILY_PROMPTS } from './sentences';

export interface PostWithRelations {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    sentence: {
        content: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
}

export const MOCK_USER_DATA: Record<string, { name: string; bio: string; image?: string }> = {
    'user_spring': {
        name: 'user_spring',
        bio: '새로운 시작과 희망의 계절, 봄을 사랑하는 작가입니다. 피어나는 꽃처럼 매일 새로운 이야기를 만들어갑니다.',
        image: 'https://i.pravatar.cc/150?u=user_spring'
    },
    'user_summer': {
        name: 'user_summer',
        bio: '여름의 조각들을 문장으로 담아내는 사람입니다. 소소한 일상과 계절의 변화를 기록하며 살아갑니다.',
        image: 'https://i.pravatar.cc/150?u=user_summer'
    },
    'user_autumn': {
        name: 'user_autumn',
        bio: '가을의 쓸쓸함 속에서 아름다움을 찾는 사람입니다. 낙엽처럼 조용히 내려앉는 생각들을 글로 남깁니다.',
        image: 'https://i.pravatar.cc/150?u=user_autumn'
    },
    'user_winter': {
        name: 'user_winter',
        bio: '고요한 겨울의 순간들을 담아냅니다. 차가운 공기 속에서 더욱 선명해지는 감정들을 기록합니다.',
        image: 'https://i.pravatar.cc/150?u=user_winter'
    },
    'user_writer': {
        name: 'user_writer',
        bio: '매일 한 줄의 문장으로 세상을 기록하는 사람입니다. 글쓰기를 통해 삶의 의미를 찾아갑니다.',
        image: 'https://i.pravatar.cc/150?u=user_writer'
    }
};

const MOCK_AUTHORS = Object.keys(MOCK_USER_DATA);

export const SENTENCE_POSTS: Record<number, PostWithRelations[]> = {};

// Generate 5 rich posts per sentence
DAILY_PROMPTS.forEach((prompt, i) => {
    SENTENCE_POSTS[i] = [
        {
            id: `day${i + 1}-p1`,
            content: `"${prompt}"에 대한 첫 번째 기록입니다. 창문을 열자마자 쏟아지는 바람의 온기가 뺨을 스치네요. 겨우내 얼어붙었던 계절의 틈 사이로 어느덧 새로운 생명이 움트고 있음을 느낍니다. 이름 모를 꽃들의 향기가 코끝을 간지럽히며, 잊고 지냈던 설렘이 다시금 마음속에서 피어오릅니다. 오늘은 유난히 하늘이 맑아 기분이 좋네요.`,
            createdAt: new Date('2026-02-15'),
            authorId: MOCK_AUTHORS[0],
            sentence: { content: prompt },
            _count: { likes: 12, comments: 2 }
        },
        {
            id: `day${i + 1}-p2`,
            content: `어제와는 확연히 다른 공기의 무게가 느껴집니다. 가벼워진 외투만큼이나 발걸음도 경쾌하네요. 골목 어귀에 핀 산수유가 노란 미소를 짓고 있었습니다. 무채색이었던 세상이 다시금 형태를 갖추고 색을 입기 시작하는 이 순간, 나는 비로소 새로운 시작을 실감합니다. "${prompt}"라는 말이 참 가슴에 와닿네요.`,
            createdAt: new Date('2026-02-15'),
            authorId: MOCK_AUTHORS[1],
            sentence: { content: prompt },
            _count: { likes: 15, comments: 3 }
        },
        {
            id: `day${i + 1}-p3`,
            content: `누군가 낮게 읊조리는 유행가 가사처럼, 바람에서 달콤한 향기가 납니다. 창가에 앉아 커피 한 잔을 마시며 밖을 내다보는 이 시간이 평화롭네요. 겨우내 미뤄뒀던 계획들을 하나둘 꺼내어 봅니다. 마음속에도 따뜻한 볕이 들기 시작하는 모양입니다. "${prompt}"라는 주제로 글을 쓰니 마음이 편안해집니다.`,
            createdAt: new Date('2026-02-16'),
            authorId: MOCK_AUTHORS[2],
            sentence: { content: prompt },
            _count: { likes: 8, comments: 1 }
        },
        {
            id: `day${i + 1}-p4`,
            content: `바람이 불 때마다 흩날리는 것은 꽃가루만이 아닙니다. 묵은 먼지를 털어내듯 마음속에 쌓였던 고민들도 함께 날아가는 기분이에요. 새로 산 신발을 신고 무작정 걷고 싶어지는 날씨입니다. 세상은 온통 연한 초록빛으로 물들어가고, 나의 하루도 그 빛깔을 닮아갑니다. "${prompt}"를 기록하며 하루를 마감합니다.`,
            createdAt: new Date('2026-02-16'),
            authorId: MOCK_AUTHORS[3],
            sentence: { content: prompt },
            _count: { likes: 21, comments: 4 }
        },
        {
            id: `day${i + 1}-p5`,
            content: `계절은 늘 예고 없이 찾아오네요. 하지만 그 익숙한 온기를 느끼는 순간, 우리는 모두 알고 있습니다. 다시 시작할 시간이 왔음을요. 담장 너머로 고개를 내민 꽃들이 반갑게 인사를 건넵니다. 이 고요하고 찬란한 시작을 온몸으로 만끽하며 "${prompt}"에 대한 기록을 남겨봅니다. 다들 행복한 하루 되세요.`,
            createdAt: new Date('2026-02-17'),
            authorId: MOCK_AUTHORS[4],
            sentence: { content: prompt },
            _count: { likes: 32, comments: 6 }
        }
    ];
});

export const getAllMockPostsForUser = (userId: string): PostWithRelations[] => {
    const allPosts: PostWithRelations[] = [];
    Object.values(SENTENCE_POSTS).forEach(posts => {
        posts.forEach(post => {
            if (post.authorId === userId) {
                allPosts.push(post);
            }
        });
    });
    return allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
