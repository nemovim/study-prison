import { fractionMath } from '../math.js';

import { getRandomInt } from '../utils.js';
import type { QuizModule } from '../types.js';

const quizConfigs = {
  1: { termCnt: 2, numMin: 1, numMax: 1, denMin: 2, denMax: 8 },
  2: { termCnt: 2, numMin: 1, numMax: 2, denMin: 2, denMax: 6 },
  3: { termCnt: 2, numMin: 1, numMax: 6, denMin: 1, denMax: 3 },
  4: { termCnt: 2, numMin: 1, numMax: 6, denMin: 1, denMax: 8 },
  5: { termCnt: 3, numMin: 1, numMax: 4, denMin: 1, denMax: 4 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

function makeQuiz(level: number): { quiz: string, answer: string } {
    if (level > maxLevel) level = getRandomInt(1, maxLevel);
    const config = quizConfigs[level as keyof typeof quizConfigs];

    const terms = [];
    for (let i = 0; i < config.termCnt; i++) {
        terms.push(fractionMath.parse(getRandomInt(config.numMin, config.numMax) + '/' + getRandomInt(config.denMin, config.denMax)));
    }

    const quiz = terms.map(t => t.toTex()).join('+');
    const answer = fractionMath.simplify(terms.map(t => t.toString()).join('+')).toString();

    return { quiz, answer };
}

const quizModule: QuizModule = {
    grade: 5,
    section: 1,
    name: '분수의 덧셈',
    maxLevel,
    makeQuiz,
};

export default quizModule;
