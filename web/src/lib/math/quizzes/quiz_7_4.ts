
import { fractionMath, decimalMath } from '../math.js';

import { getRandomInt, getRandomFloat } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
  1: { termCnt: 2, numMin: -9, numMax: 6, denMin: 1, denMax: 1, precision: 0 },
  2: { termCnt: 3, numMin: -6, numMax: 4, denMin: 1, denMax: 1, precision: 0 },
  3: { termCnt: 2, numMin: -3, numMax: 2, denMin: 1, denMax: 6, precision: 0 },
  4: { termCnt: 2, numMin: -1, numMax: 1, denMin: 1, denMax: 1, precision: 1 },
  5: { termCnt: 2, numMin: -9, numMax: 9, denMin: 1, denMax: 9, precision: 0 },
  6: { termCnt: 2, numMin: -2, numMax: 2, denMin: 1, denMax: 1, precision: 1 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function makeQuiz(level: number): { quiz: string, answer: string } {
    if (level > maxLevel) level = getRandomInt(1, maxLevel);
    const config = quizConfigs[level as keyof typeof quizConfigs];

    const terms = [];
    for (let i = 0; i < config.termCnt; i++) {
        terms.push(`(${getRandomFloat(config.numMin, config.numMax, config.precision, false)}/${getRandomFloat(config.denMin, config.denMax, config.precision, false)})`);
    }

    if (config.precision === 0) {
        const quiz = terms.map((term, i) => {
            const parsedTerm = fractionMath.simplifyCore(term).toTex();
            if (i !== 0 && parsedTerm.startsWith('-')) return `(${parsedTerm})`;
            return parsedTerm;
        }).join('\\times');
        const answer = fractionMath.simplify(terms.join('*')).toString();
        return { quiz, answer };
    } else {
        const quiz = terms.map((term, i) => {
            const parsedTerm = decimalMath.simplifyCore(term).toTex();
            if (i !== 0 && parsedTerm.startsWith('-')) return `(${parsedTerm})`;
            return parsedTerm;
        }).join('\\times');
        const answer = decimalMath.simplify(terms.join('*'), {}, { exactFractions: false }).toString();
        return { quiz, answer };
    }
}

const quizModule: QuizModule = {
    grade: 7,
    section: 4,
    name: '유리수의 곱셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;
