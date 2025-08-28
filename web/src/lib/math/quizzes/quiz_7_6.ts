import {
    addSimilarFractionTermsInExpression,
    getRandomExpression,
    getRandomInt,
    stringifyExpression,
    type GenerationConfig,
    clearExpression
} from '../utils.js';

// 다항식의 덧셈과 뺄셈
export default function makeQuiz(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    const getQuizConfig = (level: number): GenerationConfig => {
        const baseConfig: GenerationConfig = {
            symbolMin: 0,
            symbolMax: 1,
            symbolPowerMin: 1,
            symbolPowerMax: 1,
            symbolCnt: 1,
            allowNumericFraction: false
        };

        switch (level) {
            case 1: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -5,
                numIntMax: 5,
            };
            case 2: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -5,
                numIntMax: 5,
                denIntMin: 1,
                denIntMax: 4,
                allowNumericFraction: true,
            };
            case 3: return {
                ...baseConfig,
                termCnt: 5,
                numIntMin: -3,
                numIntMax: 3,
                symbolMin: 0,
                symbolMax: 2,
            };
            case 4: return {
                ...baseConfig,
                termCnt: 5,
                numIntMin: -3,
                numIntMax: 3,
                symbolPowerMax: 2
            };
            case 5: return {
                ...baseConfig,
                termCnt: 4,
                numIntMin: -3,
                numIntMax: 3,
                symbolMin: 0,
                symbolMax: 2,
                symbolCnt: 2,
            };
            default: return getQuizConfig(getRandomInt(1, 5));
        }
    };

    const config = getQuizConfig(level);
    const expr = getRandomExpression(config);
    
    quiz = stringifyExpression(clearExpression(expr)) + '=?';

    if (!quiz.includes('x'))
        return makeQuiz(level);

    const result = addSimilarFractionTermsInExpression(expr);
    answer = stringifyExpression(clearExpression(result));

    if (quiz.startsWith('+')) quiz = quiz.slice(1);
    if (answer.startsWith('+')) answer = answer.slice(1);

    return { quiz, answer };
}