import {
    addSimilarFractionTermsInExpression,
    getRandomExpression,
    getRandomInt,
    stringifyExpression,
    type Expression,
    type GenerationConfig,
    clearExpression
} from '../utils.js';

// 정수와 유리수의 덧셈과 뺄셈
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
                numIntMin: -5,
                numIntMax: 5,
                allowNumericFraction: false
            };
            case 2: return { 
                ...baseConfig,
                termCnt: 2,
                numIntMin: -25,
                numIntMax: 15,
                allowNumericFraction: false
            };
            case 3: return { 
                ...baseConfig,
                termCnt: 3,
                numIntMin: -15,
                numIntMax: 10,
                allowNumericFraction: false
            };
            case 4: return { 
                ...baseConfig,
                termCnt: 2,
                numIntMin: -4,
                numIntMax: 2,
                denIntMin: 1,
                denIntMax: 3,
                allowNumericFraction: true
            };
            case 5: return { 
                ...baseConfig,
                termCnt: 2,
                numIntMin: -8,
                numIntMax: 6,
                denIntMin: 1,
                denIntMax: 5,
                allowNumericFraction: true
            };
            case 6: return { 
                ...baseConfig,
                termCnt: 2,
                numIntMin: -1,
                numIntMax: 1,
                allowNumericFraction: false,
                allowFloat: true,
                precision: 1,
            };
            case 7: return { 
                ...baseConfig,
                termCnt: 2,
                numIntMin: -7,
                numIntMax: 7,
                allowNumericFraction: false,
                allowFloat: true,
                precision: 1,
            };
            default: return getQuizConfig(getRandomInt(1, 7));
        }
    };

    const config: GenerationConfig = getQuizConfig(level);
    const expr: Expression = getRandomExpression(config);

    quiz = stringifyExpression(clearExpression(expr)) + '=?';
    const result = addSimilarFractionTermsInExpression(expr);
    answer = stringifyExpression(clearExpression(result));
    if (quiz.startsWith('+')) quiz = quiz.slice(1);
    if (answer.startsWith('+')) answer = answer.slice(1);

    return { quiz, answer };
}
