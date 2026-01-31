import { fractionMath } from '../math.js';
import { getRandomInt, getCleanTex, getQuizConfig } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
    // [1-2] 정수 나눗셈 (나누어떨어지는 경우 위주)
    1: { termCnt: 2, numMin: -12, numMax: 12, denMin: 1, denMax: 1 },
    2: { termCnt: 2, numMin: -20, numMax: 20, denMin: 1, denMax: 1 },

    // [3-5] 분수의 나눗셈 기초 (역수 개념)
    3: { termCnt: 2, numMin: -5, numMax: 5, denMin: 2, denMax: 6 },
    4: { termCnt: 2, numMin: -9, numMax: 9, denMin: 2, denMax: 9 },
    5: { termCnt: 3, numMin: -4, numMax: 4, denMin: 2, denMax: 5 }, // 3개 항

    // [6-8] 심화 유리수 나눗셈
    6: { termCnt: 2, numMin: -15, numMax: 15, denMin: 2, denMax: 12 },
    7: { termCnt: 3, numMin: -6, numMax: 6, denMin: 2, denMax: 8 },
    8: { termCnt: 3, numMin: -10, numMax: 10, denMin: 2, denMax: 10 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

/**
 * 나눗셈에서 음수나 분수 항에 괄호를 입히는 포맷터
 */
function formatDivision(tex: string, isFirst: boolean): string {
    // 첫 번째 항이 아니고 음수라면 반드시 괄호 필요: a ÷ (-b)
    // 분수 형태(\frac)이면서 음수인 경우도 괄호를 입히는 것이 가독성에 좋음
    if (tex.startsWith('-')) {
        return `\\left(${tex}\\right)`;
    }
    return tex;
}

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);
    
    const terms: string[] = [];
    const expressions: string[] = [];

    for (let i = 0; i < config.termCnt; i++) {
        // 분모가 0이 되지 않도록 처리
        const den = getRandomInt(config.denMin, config.denMax, false);
        // 나눗셈에서 제수(나누는 수)가 0이 되지 않도록 처리
        const num = getRandomInt(config.numMin, config.numMax, i === 0); 

        const termStr = `(${num}/${den})`;
        terms.push(termStr);
        
        // getCleanTex로 부호가 정리된 Tex를 가져온 뒤 괄호 포맷팅
        const cleanTex = getCleanTex(termStr, 'F');
        expressions.push(formatDivision(cleanTex, i === 0));
    }

    // mathjs 연산 시 문자열 조립: (a/b)/(c/d)
    const fullExpr = terms.join('/');
    
    // 나눗셈은 결과가 소수로 떨어지지 않는 경우가 많으므로 항상 fractionMath 사용
    const answer = fractionMath.simplify(fullExpr).toString();

    return { 
        quiz: expressions.join(' \\div '), 
        answer: answer 
    };
}

const quizModule: QuizModule = {
    grade: 7,
    section: 5,
    name: '유리수의 나눗셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;