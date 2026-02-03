import { fractionMath, decimalMath } from '../math.js';
import { getRandomInt, getRandomFloat, getCleanTex, generateRandomPattern, getQuizConfig } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
    // [1-3] 정수 곱셈 기초
    1: { termCnt: 2, numMin: -9, numMax: 9, denMin: 1, denMax: 1, precision: 0 },
    2: { termCnt: 3, numMin: -5, numMax: 5, denMin: 1, denMax: 1, precision: 0 },
    // [Level 3] 항 3개, 숫자 범위 확대 (-12 ~ 12)
    // 구구단 범위를 살짝 넘나드는 숫자를 배치하여 곱셈 숙련도를 높입니다.
    3: { termCnt: 3, numMin: -12, numMax: 12, denMin: 1, denMax: 1, precision: 0 },

    // [4-6] 기초 분수/소수 곱셈
    4: { termCnt: 2, numMin: -1.2, numMax: 1.2, denMin: 1, denMax: 1, precision: 1 },
    5: { termCnt: 2, numMin: -5, numMax: 5, denMin: 2, denMax: 5, precision: 0 },
    6: { termCnt: 2, numMin: -0.19, numMax: 0.19, denMin: 1, denMax: 1, precision: 2 },

    // [7-9] 심화 및 혼합 계산
    7: { termCnt: 3, numMin: -4, numMax: 4, denMin: 2, denMax: 6, precision: 0 },
    8: { termCnt: 2, numMin: -3, numMax: 3, denMin: 2, denMax: 5, precision: 1 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function formatMultiplication(tex: string): string {
    // 곱셈은 첫 번째 항이라도 음수면 괄호를 치는 것이 표준 표기법인 경우가 많음
    return tex.startsWith('-') ? `\\left(${tex}\\right)` : tex;
}

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);
    const terms: string[] = [];
    const expressions: string[] = [];

    const typePattern = (activeLevel >= 8)
        ? generateRandomPattern(['F', 'D'], config.termCnt)
        : new Array(config.termCnt).fill(config.precision === 0 ? 'F' : 'D');

    for (let i = 0; i < config.termCnt; i++) {
        const type = typePattern[i];

        if (type === 'F') {
            // 분수 케이스: 정수 분자 / 정수 분모
            const den = (activeLevel >= 8)
                ? [2, 4, 5, 10][getRandomInt(0, 3)]
                : getRandomInt(config.denMin, config.denMax);
            const num = getRandomInt(config.numMin, config.numMax);

            const termStr = `(${num}/${den})`; // (3/4)
            terms.push(termStr);
            expressions.push(formatMultiplication(getCleanTex(termStr, 'F')));
        } else {
            // 소수 케이스: 소수점 값 자체를 term으로 사용
            const val = getRandomFloat(config.numMin, config.numMax, config.precision, false);

            terms.push(val.toString()); // "0.8" (분수 형태가 아닌 단일 값으로)
            expressions.push(formatMultiplication(getCleanTex(val.toString(), 'D')));
        }
    }

    const fullExpr = terms.join('*');
    const isFractionOutput = config.precision === 0 || activeLevel >= 8;

    let answer = isFractionOutput
        ? fractionMath.simplify(fullExpr).toString()
        : decimalMath.simplify(fullExpr, {}, { exactFractions: false }).toString();

    return { quiz: expressions.join(' \\times '), answer: answer };
}

const quizModule: QuizModule = {
    grade: 7,
    section: 4,
    name: '유리수의 곱셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;
