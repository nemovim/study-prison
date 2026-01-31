import { fractionMath } from '../math.js';
import { getRandomInt, generateFractionTerm, generateRandomPattern, getQuizConfig } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
    // 필드 구조: termCnt, ops, sameDen, numMin, numMax, denMin, denMax, naturalMax
    1: { termCnt: 2, ops: ['+'], sameDen: true,  numMin: 1, numMax: 5, denMin: 4, denMax: 9,  naturalMax: 0 },
    2: { termCnt: 2, ops: ['-'], sameDen: true,  numMin: 1, numMax: 9, denMin: 4, denMax: 9,  naturalMax: 0 },
    
    3: { termCnt: 2, ops: ['+'], sameDen: false, numMin: 1, numMax: 5, denMin: 2, denMax: 6,  naturalMax: 3 },
    4: { termCnt: 2, ops: ['-'], sameDen: false, numMin: 1, numMax: 5, denMin: 2, denMax: 6,  naturalMax: 3 },
    
    5: { termCnt: 2, ops: ['+'], sameDen: false, numMin: 1, numMax: 7, denMin: 2, denMax: 9,  naturalMax: 0 },
    6: { termCnt: 2, ops: ['-'], sameDen: false, numMin: 2, numMax: 12, denMin: 3, denMax: 12, naturalMax: 0 },
    
    7: { termCnt: 3, ops: ['+', '-'], sameDen: false, numMin: 1, numMax: 5, denMin: 2, denMax: 8,  naturalMax: 0 },
    8: { termCnt: 3, ops: ['+', '-'], sameDen: false, numMin: 1, numMax: 8, denMin: 2, denMax: 10, naturalMax: 5 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);
    
    // 구조가 동일하므로 config.sameDen이 항상 존재함
    const fixedDen = config.sameDen ? getRandomInt(config.denMin, config.denMax) : undefined;

    // naturalMax가 0보다 클 때만 자연수 항 생성 로직 작동
    const naturalIdx = config.naturalMax > 0 ? getRandomInt(0, config.termCnt - 1) : -1;

    const terms = Array.from({ length: config.termCnt }, (_, i) => {
        if (i === naturalIdx) {
            const natVal = getRandomInt(1, config.naturalMax);
            return { tex: `${natVal}`, str: `${natVal}/1`, den: 1 };
        }
        return generateFractionTerm(config.numMin, config.numMax, config.denMin, config.denMax, fixedDen);
    });

    const opPattern = generateRandomPattern([...config.ops], config.termCnt - 1);

    let quiz = terms[0].tex;
    let mathExpr = `(${terms[0].str})`;

    for (let i = 1; i < config.termCnt; i++) {
        const op = opPattern[i - 1];
        const currentTermStr = `(${terms[i].str})`;

        if (op === '-') {
            const currentVal = fractionMath.evaluate(mathExpr);
            const nextVal = fractionMath.evaluate(terms[i].str);

            if (fractionMath.larger(nextVal, currentVal)) {
                quiz = `${terms[i].tex} - ${quiz}`;
                mathExpr = `${currentTermStr} - (${mathExpr})`;
            } else {
                quiz += ` - ${terms[i].tex}`;
                mathExpr += ` - ${currentTermStr}`;
            }
        } else {
            quiz += ` + ${terms[i].tex}`;
            mathExpr += ` + ${currentTermStr}`;
        }
    }

    return {
        quiz,
        answer: fractionMath.simplify(mathExpr).toString()
    };
}

const quizModule: QuizModule = {
    grade: 5,
    section: 1,
    name: '분수의 덧셈과 뺄셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;