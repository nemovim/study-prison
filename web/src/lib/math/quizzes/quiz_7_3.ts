import { getRandomInt, getRandomFloat } from '../utils.js';
import type { QuizModule } from '../types.js';
import { decimalMath, fractionMath } from '../math.js';
import { generateRandomPattern, getCleanTex, getQuizConfig } from '../utils.js';

const quizConfigs = {
    // [1-3] 정수: 부호와 항 개수 확장
    1: { termCnt: 2, numMin: -9, numMax: 9, denMin: 1, denMax: 1, precision: 0 },
    2: { termCnt: 2, numMin: -40, numMax: 40, denMin: 1, denMax: 1, precision: 0 },
    3: { termCnt: 3, numMin: -15, numMax: 15, denMin: 1, denMax: 1, precision: 0 },

    // [4-6] 소수와 분수 기초: 2개 항 집중
    4: { termCnt: 2, numMin: -1.5, numMax: 1.5, denMin: 1, denMax: 1, precision: 1 },
    5: { termCnt: 2, numMin: -5, numMax: 5, denMin: 2, denMax: 5, precision: 0 },
    6: { termCnt: 2, numMin: -5.0, numMax: 5.0, denMin: 1, denMax: 1, precision: 1 }, // 여기까지 소수 2개 항

    // [7-9] 심화: 분수 통분 & 소수 3개 항 준비
    7: { termCnt: 2, numMin: -9, numMax: 9, denMin: 2, denMax: 10, precision: 0 },
    8: { termCnt: 3, numMin: -2.0, numMax: 2.0, denMin: 1, denMax: 1, precision: 1 }, // 소수 3개 항 (절대값 낮춤)
    9: { termCnt: 2, numMin: -0.9, numMax: 0.9, denMin: 1, denMax: 1, precision: 2 }, // 소수 2개 항 (두 자리)

    // [10-11] 숙련: 분수 3개 항 & 혼합 계산
    10: { termCnt: 3, numMin: -6, numMax: 6, denMin: 2, denMax: 6, precision: 0 },
    11: { termCnt: 3, numMin: -3, numMax: 3, denMin: 2, denMax: 5, precision: 1 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function formatAddition(tex: string, isFirst: boolean): string {
    if (isFirst) return tex;
    
    if (tex.startsWith('-')) {
        const absTex = tex.substring(1);
        // 50% 확률로 뺄셈으로 표현하거나, 더하기 괄호로 표현
        return Math.random() > 0.5 ? ` - ${absTex}` : ` + \\left(${tex}\\right)`;
    }
    return ` + ${tex}`;
}

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);
    const terms: string[] = [];
    const expressions: string[] = [];
    
    const typePattern = (activeLevel === 11) 
        ? generateRandomPattern(['F', 'D'], config.termCnt) 
        : new Array(config.termCnt).fill(config.precision === 0 ? 'F' : 'D');

    for (let i = 0; i < config.termCnt; i++) {
        const type = typePattern[i];
        let den = (activeLevel === 11 && type === 'F') 
            ? [2, 4, 5, 10][getRandomInt(0, 3)] 
            : getRandomInt(config.denMin, config.denMax);
        
        const num = type === 'F' 
            ? getRandomInt(config.numMin, config.numMax)
            : getRandomFloat(config.numMin, config.numMax, config.precision, false);

        const termStr = `(${num}/${den})`;
        terms.push(termStr);
        expressions.push(formatAddition(getCleanTex(termStr, type), i === 0));
    }

    const fullExpr = terms.join('+');
    const isFractionOutput = config.precision === 0 || activeLevel === 11;
    
    let answer = isFractionOutput
        ? fractionMath.simplify(fullExpr).toString()
        : decimalMath.simplify(fullExpr, {}, { exactFractions: false }).toString();

    return { quiz: expressions.join('').trim(), answer: answer };
}

const quizModule: QuizModule = {
    grade: 7,
    section: 3,
    name: '유리수의 덧셈과 뺄셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;