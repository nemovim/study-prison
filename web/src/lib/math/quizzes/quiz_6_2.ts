import { fractionMath } from '../math.js';
import { getRandomInt, generateFractionTerm, getQuizConfig } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
    // [1-2] (분수) ÷ (자연수) - 6학년 1학기 수준
    1: { termCnt: 2, numMin: 1, numMax: 8, denMin: 2, denMax: 9, divisorNatural: true },
    2: { termCnt: 2, numMin: 3, numMax: 15, denMin: 2, denMax: 12, divisorNatural: true }, // 더 큰 수의 나눗셈

    // [3-4] (분수) ÷ (분수) - 6학년 2학기 수준
    3: { termCnt: 2, numMin: 1, numMax: 9, denMin: 2, denMax: 12, divisorNatural: false },
    4: { termCnt: 2, numMin: 3, numMax: 16, denMin: 3, denMax: 15, divisorNatural: false }, // 가분수 및 큰 수 약분

    // [5] 세 분수의 나눗셈 혼합
    5: { termCnt: 3, numMin: 1, numMax: 6, denMin: 2, denMax: 8, divisorNatural: false },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);

    const terms = Array.from({ length: config.termCnt }, (_, i) => {
        // 나누는 수(divisor, i=1)가 자연수여야 하는 레벨 제어
        const den = (config.divisorNatural && i === 1) 
            ? 1 
            : getRandomInt(config.denMin, config.denMax, false);
            
        // 분모 1, 1을 고정으로 넘기고 실제 den을 fixedDen으로 주입하는 기존 방식 유지
        return generateFractionTerm(config.numMin, config.numMax, 1, 1, den);
    });

    let quiz = terms[0].tex;
    // 나눗셈 연산 오류 방지를 위해 항마다 괄호 처리 강화
    let mathExpr = `(${terms[0].str})`;

    for (let i = 1; i < config.termCnt; i++) {
        quiz += ` \\div ${terms[i].tex}`;
        mathExpr += `/(${terms[i].str})`;
    }

    return { 
        quiz, 
        answer: fractionMath.simplify(mathExpr).toString() 
    };
}

const quizModule: QuizModule = {
    grade: 6,
    section: 2,
    name: '분수의 나눗셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;