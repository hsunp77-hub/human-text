export type AgeRange = '10대' | '20대' | '30대' | '40대' | '50대' | '60대' | '70대' | '일반';
export type Gender = '여성' | '남성' | '선택안함';

export interface SentenceGroup {
    code: string;
    age: AgeRange;
    gender: Gender | '공통';
    description: string;
    sentences: string[];
}

export const COURSE_CONTENT: Record<string, SentenceGroup> = {
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
    // G4~G15 placeholders effectively using G1 content or patterns as per prompt "G4~G15 structure follows same pattern"
    // Since the user provided specific examples for G1-G3 and requested expansion, I will map them logically.
    // For the sake of this implementation, I will generate the structure. If exact sentences are missing, I will restart G1 or stick to the prompt's instruction "Same structure".
    // However, for a real app, we need unique content. I'll duplicate G1/G2/G3 logic or placeholders if specific text isn't provided. 
    // Wait, the prompt said "Prioritize addressing... 21 sentences... G4-G15 follow same structure".
    // AND "previously organized entire sentence set can be used". I don't have that "previously organized set" in the context of *this* conversation.
    // I will fill G4-G15 with placeholders or repeat G1 for now, noting that content needs to be filled.
    // ACTUALLY, I should be smart. G4 (20s F) likely isn't "School started".
    // I will create G4-G15 with the titles provided and placeholder sentences or generic ones until real data is inserted.
    // Or better, I'll use G1 for G4-G15 to avoid errors, but change the description.
    // The user said: "G4~G15는 동일 구조로 이어지며, 이전에 정리한 전체 문장 세트 그대로 사용 가능"
    // I will use G1 sentences for G4-G15 for now to ensure the app works, as I don't have the specific text for those.

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
    G15: { code: 'G15', age: '70대', gender: '남성', description: '전 생애 회상', sentences: [] },
};

// Fill empty groups with G1 content for now to prevent crashes.
// In a real scenario, we'd content-fill these.
Object.keys(COURSE_CONTENT).forEach(key => {
    if (COURSE_CONTENT[key].sentences.length === 0) {
        COURSE_CONTENT[key].sentences = [...COURSE_CONTENT['G1'].sentences];
    }
});


export function determineGroupCode(age: AgeRange, gender: Gender): string {
    if (age === '일반' || gender === '선택안함') return 'G1';

    switch (age) {
        case '10대': return gender === '여성' ? 'G2' : 'G3';
        case '20대': return gender === '여성' ? 'G4' : 'G5';
        case '30대': return gender === '여성' ? 'G6' : 'G7';
        case '40대': return gender === '여성' ? 'G8' : 'G9';
        case '50대': return gender === '여성' ? 'G10' : 'G11';
        case '60대': return gender === '여성' ? 'G12' : 'G13';
        case '70대': return gender === '여성' ? 'G14' : 'G15';
        default: return 'G1';
    }
}

export function getGroupCombined(code: string | null) {
    return COURSE_CONTENT[code || 'G1'] || COURSE_CONTENT['G1'];
}
