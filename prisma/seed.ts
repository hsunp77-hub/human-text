import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCK_ANSWERS = [
    "그날의 기억이 선명하게 떠오른다. 바람의 냄새까지도.",
    "처음에는 망설였지만, 결국 한 발자국 내디뎠던 순간이었다.",
    "돌이켜보면 그때가 내 인생의 전환점이었을지도 모른다.",
    "가슴 한구석이 아려오는 느낌, 아직도 생생하다.",
    "누구나 겪는 일이라고 위로했지만, 나에게는 세상이 무너지는 것 같았다.",
    "웃음이 터져 나왔다. 별거 아닌 일에도 행복했던 시절.",
    "그때의 나는 무엇을 그토록 두려워했을까?",
    "손을 내밀어준 친구가 없었다면 견디기 힘들었을 것이다.",
    "계절이 바뀌는 냄새를 맡으며 서성였던 골목길.",
    "거울 속의 내 모습이 낯설게 느껴지던 날.",
    "소리 내어 울고 싶었지만 꾹 참았던 밤.",
    "햇살이 눈부시게 쏟아지던 운동장, 그리고 너.",
    "책상 위에 놓인 쪽지 하나에 설레었던 오후.",
    "비 오는 날 우산 없이 뛰어가며 느꼈던 해방감.",
    "아버지의 뒷모습이 유난히 작아 보였던 그날 저녁.",
    "첫 월급을 받아 들고 부모님께 내복을 사드렸던 기억.",
    "아이의 첫 울음소리를 듣고 나도 모르게 눈물이 났다.",
    "떠나는 기차를 보며 손을 흔들던 마지막 모습.",
    "빈방에 홀로 앉아 옛 사진첩을 넘겨보았다.",
    "이제는 알 것 같다. 그 모든 것이 사랑이었다는 것을.",
    "다시 돌아갈 수 있다면, 더 많이 사랑한다고 말해주고 싶다."
];

const COURSE_CONTENT: any = {
    G1: {
        code: 'G1',
        age: '일반',
        gender: '공통',
        description: '계절 중심',
        sentences: [
            "봄바람이 불었다.", "여름이 시작됐다.", "장마가 길어졌다.", "가을 냄새가 났다.", "첫눈이 내렸다.",
            "벚꽃이 흩날렸다.", "매미 소리가 들렸다.", "낙엽을 밟았다.", "찬 공기가 스며들었다.", "해가 길어졌다.",
            "밤이 빨리 찾아왔다.", "비가 쏟아졌다.", "햇살이 유난히 따뜻했다.", "바람이 거셌다.", "하늘이 높아 보였다.",
            "구름이 빨리 흘렀다.", "우산을 접었다.", "외투를 꺼냈다.", "에어컨을 틀었다.", "창문을 열었다.", "계절이 바뀌고 있었다."
        ]
    },
    G2: {
        code: 'G2',
        age: '10대',
        gender: '여성',
        description: '학교·성장 중심',
        sentences: [
            "새 학기가 시작됐다.", "교복이 어색했다.", "시험지가 배부됐다.", "운동회가 열렸다.", "짝이 바뀌었다.",
            "친구와 다퉜다.", "좋아하는 사람이 생겼다.", "성적표를 받았다.", "창밖을 오래 봤다.", "엄마와 말다툼했다.",
            "SNS에 사진을 올렸다.", "교실이 시끄러웠다.", "졸업을 상상했다.", "혼자 울었다.", "친구에게 기대었다.",
            "내가 달라지고 있었다.", "머리를 자르고 싶어졌다.", "시험을 망쳤다.", "비밀을 만들었다.", "교실이 낯설었다.", "어른이 되고 싶었다."
        ]
    },
    G3: {
        code: 'G3',
        age: '10대',
        gender: '남성',
        description: '학교·경쟁 중심',
        sentences: [
            "운동장이 시끄러웠다.", "체육 시간이 기다려졌다.", "시험을 망쳤다.", "친구와 경쟁했다.", "키가 자랐다.",
            "목소리가 변했다.", "좋아하는 애가 생겼다.", "혼났다.", "인정받고 싶었다.", "첫 고백을 고민했다.",
            "성적표를 숨겼다.", "친구와 화해했다.", "졸업식이 다가왔다.", "아버지와 부딪혔다.", "자존심이 상했다.",
            "나만 다른 것 같았다.", "운동회에서 뛰었다.", "미래를 묻기 시작했다.", "혼자 버텼다.", "어른을 흉내 냈다.", "나를 증명하고 싶었다."
        ]
    },
    // Using G1 content for default for G4 onwards but creating keys
    G4: { code: 'G4', age: '20대', gender: '여성', description: '첫 경험 중심', sentences: [] },
    G5: { code: 'G5', age: '20대', gender: '남성', description: '도전·책임 중심', sentences: [] },
    G6: { code: 'G6', age: '30대', gender: '여성', description: '10·20대 회상', sentences: [] },
    G7: { code: 'G7', age: '30대', gender: '남성', description: '10·20대 회상', sentences: [] },
    G8: { code: 'G8', age: '40대', gender: '여성', description: '10~30대 회상', sentences: [] },
    G9: { code: 'G9', age: '40대', gender: '남성', description: '10~30대 회상', sentences: [] },
    G10: { code: 'G10', age: '50대', gender: '여성', description: '10~40대 회상', sentences: [] },
    G11: { code: 'G11', age: '50대', gender: '남성', description: '10~40대 회상', sentences: [] },
    G12: { code: 'G12', age: '60대', gender: '여성', description: '10~50대 회상', sentences: [] },
    G13: { code: 'G13', age: '60대', gender: '남성', description: '10~50대 회상', sentences: [] },
    G14: { code: 'G14', age: '70대', gender: '여성', description: '전 생애 회상', sentences: [] },
    G15: { code: 'G15', age: '70대', gender: '남성', description: '전 생애 회상', sentences: [] }
};

// Fill empty groups
Object.keys(COURSE_CONTENT).forEach(key => {
    if (COURSE_CONTENT[key].sentences.length === 0) {
        COURSE_CONTENT[key].sentences = [...COURSE_CONTENT['G1'].sentences];
    }
});

async function main() {
    console.log('Start seeding...');

    // 1. Create Sentences for all groups
    console.log('Seeding sentences...');
    for (const groupKey in COURSE_CONTENT) {
        const group = COURSE_CONTENT[groupKey];
        for (let i = 0; i < group.sentences.length; i++) {
            const dayIndex = i + 1;
            const content = group.sentences[i];

            const existingSentence = await prisma.dailySentence.findFirst({
                where: {
                    dayIndex,
                    groupCode: group.code
                }
            });

            if (existingSentence) {
                await prisma.dailySentence.update({
                    where: { id: existingSentence.id },
                    data: { content }
                });
            } else {
                await prisma.dailySentence.create({
                    data: {
                        dayIndex,
                        groupCode: group.code,
                        content
                    }
                });
            }
        }
    }

    // 2. Create Users (Personas)
    console.log('Seeding users and posts...');
    const groups = Object.values(COURSE_CONTENT);

    for (const group of groups as any[]) {
        const genderLabel = group.gender === '공통' || group.gender === '선택안함' ? 'N' : (group.gender === '여성' ? 'F' : 'M');
        const ageLabel = group.age === '일반' ? 'Gen' : group.age.replace('대', '');
        const nickname = `User_${ageLabel}_${genderLabel}`; // e.g., User_30_F

        // Check user existence
        let user = await prisma.user.findUnique({ where: { name: nickname } });

        if (user) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    sentenceGroup: group.code,
                    ageRange: group.age as string,
                    gender: group.gender,
                }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    name: nickname,
                    sentenceGroup: group.code,
                    ageRange: group.age as string,
                    gender: group.gender,
                    isSignupCompleted: true,
                }
            });
        }

        // Create Posts
        console.log(`Creating posts for ${nickname}...`);
        for (let i = 0; i < 21; i++) {
            const dayIndex = i + 1;
            const sentence = await prisma.dailySentence.findFirst({
                where: {
                    dayIndex,
                    groupCode: group.code
                }
            });

            if (!sentence) continue;

            const existingPost = await prisma.post.findFirst({
                where: {
                    authorId: user.id,
                    sentenceId: sentence.id
                }
            });

            if (existingPost) continue;

            const mockContent = `${group.age} ${group.gender}의 ${dayIndex}일차 기록: ${MOCK_ANSWERS[i % MOCK_ANSWERS.length]}\n\n(질문: ${sentence.content})`;

            await prisma.post.create({
                data: {
                    content: mockContent,
                    authorId: user.id,
                    sentenceId: sentence.id,
                    createdAt: new Date(Date.now() - (21 - i) * 86400000) // Backdate
                }
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
