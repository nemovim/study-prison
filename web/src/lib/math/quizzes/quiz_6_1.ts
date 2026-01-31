import { fractionMath } from '../math.js';
import { getRandomInt, generateFractionTerm, getQuizConfig } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
    // [1-2] (분수) × (자연수) 또는 (자연수) × (분수)
    1: { termCnt: 2, numMin: 1, numMax: 5, denMin: 2, denMax: 6, forceNatural: true },
    2: { termCnt: 2, numMin: 2, numMax: 9, denMin: 3, denMax: 12, forceNatural: true }, // 숫자 범위 확대

    // [3-4] (분수) × (분수) - 진분수 및 가분수 약분 연습
    3: { termCnt: 2, numMin: 1, numMax: 6, denMin: 2, denMax: 9, forceNatural: false },
    4: { termCnt: 2, numMin: 2, numMax: 12, denMin: 3, denMax: 15, forceNatural: false }, // 큰 수 약분 연습

    // [5] 세 분수의 곱셈
    5: { termCnt: 3, numMin: 1, numMax: 5, denMin: 2, denMax: 8, forceNatural: false },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);

    const terms = Array.from({ length: config.termCnt }, (_, i) => {
        // 레벨 1-2에서 두 번째 항(i===1)은 자연수로 고정 (분모 1)
        // 레벨 3부터는 config에서 설정한 den 범위를 따름
        const den = (config.forceNatural && i === 1) 
            ? 1 
            : getRandomInt(config.denMin, config.denMax, false);
            
        // generateFractionTerm(numMin, numMax, denMin, denMax, fixedDen)
        // denMin/Max는 사용하지 않고 fixedDen(네 번째 인자)으로 분모를 직접 주입
        return generateFractionTerm(config.numMin, config.numMax, 1, 1, den);
    });

    let quiz = terms[0].tex;
    let mathExpr = `(${terms[0].str})`;

    for (let i = 1; i < config.termCnt; i++) {
        // 곱셈 기호로 연결
        quiz += ` \\times ${terms[i].tex}`;
        mathExpr += `*(${terms[i].str})`;
    }

    return { 
        quiz, 
        answer: fractionMath.simplify(mathExpr).toString() 
    };
}

const quizModule: QuizModule = {
    grade: 6,
    section: 1,
    name: '분수의 곱셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;