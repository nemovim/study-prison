import {
    getRandomExpression,
    getRandomInt,
    type Expression,
    type GenerationConfig,
    stringifyFractionTerm,
    multiplyFractionTerms,
    getOneFractionTerm,
    clearFractionTerm
} from '../utils.js';

// 정수와 유리수의 곱셈
export default function makeQuiz(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    const getQuizConfig = (level: number): GenerationConfig => {
        const baseConfig: GenerationConfig = {
            symbolMin: 0,
            symbolMax: 0,
            symbolPowerMin: 0,
            symbolPowerMax: 0,
            symbolCnt: 0,
        };

        switch (level) {
            case 1: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: -9,
                numIntMax: 9,
                allowNumericFraction: false
            };
            case 2: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -4,
                numIntMax: 4,
                allowNumericFraction: false
            };
            case 3: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: -3,
                numIntMax: 3,
                denIntMin: 1,
                denIntMax: 3,
                allowNumericFraction: true
            };
            case 4: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -6,
                numIntMax: 6,
                denIntMin: 1,
                denIntMax: 6,
                allowNumericFraction: true
            };
            default: return getQuizConfig(getRandomInt(1, 4));
        }
    };

    const config: GenerationConfig = getQuizConfig(level);
    const expr: Expression = getRandomExpression(config);

    const parsedExpr = expr.map(fracTerm => {
        const fracTermString = stringifyFractionTerm(fracTerm);
        return `${fracTermString.startsWith('+') ? fracTermString.slice(1) : `(${fracTermString})`}`;
    });

    quiz = parsedExpr.join('\\times') + '=?';

    const result = expr.reduce((prev, fracTerm) => {
        return multiplyFractionTerms(prev, fracTerm);
    }, getOneFractionTerm());

    answer = stringifyFractionTerm(clearFractionTerm(result));
    if (answer.startsWith('+')) answer = answer.slice(1);

    return { quiz, answer };
}
