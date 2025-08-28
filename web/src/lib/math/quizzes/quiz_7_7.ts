import { getRandomExpression, getRandomInt, addSimilarFractionTermsInExpression, stringifyExpression, stringifyFractionTerm, multiplyFractionTerms, getOneFractionTerm, clearFractionTerm, clearExpression, distributeExpressionByFractionTerm } from '../utils.js';
import type { GenerationConfig } from '../utils.js';

// 다항식의 곱셈
export default function makeQuiz(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    const getQuizConfig = (level: number): GenerationConfig => {
        const baseConfig: GenerationConfig = {
            symbolMin: 0,
            symbolMax: 2,
            symbolPowerMin: 1,
            symbolPowerMax: 1,
            symbolCnt: 1,
            allowNumericFraction: false
        };

        switch (level) {
            case 1: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: -3,
                numIntMax: 3,
            };
            case 2: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -3,
                numIntMax: 3,
                symbolCnt: 3,
                symbolPowerMin: 0,
            };
            case 3: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: -6,
                numIntMax: 6,
                denIntMin: 1,
                denIntMax: 4,
                allowNumericFraction: true,
            };
            case 4: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: -3,
                numIntMax: 3,
                symbolCnt: 2,
            };
            default: return getQuizConfig(getRandomInt(1, 4));
        }
    };

    const config = getQuizConfig(level);
    if (level <= 3) {
        const expr = getRandomExpression(config);

        const parsedExpr = expr.map(fracTerm => {
            const fracTermString = stringifyFractionTerm(fracTerm);
            return `${fracTermString.startsWith('+') ? fracTermString.slice(1) : `(${fracTermString})`}`;
        });

        quiz = parsedExpr.join('\\times') + '=?';

        const result = expr.reduce((prev, fracTerm) => {
            return multiplyFractionTerms(prev, fracTerm);
        }, getOneFractionTerm());
        answer = stringifyFractionTerm(clearFractionTerm(result));
    } else if (level === 4) {
        const expr = getRandomExpression(config);
        const coefFracTerm = expr.pop() || getOneFractionTerm();
        quiz = `${stringifyFractionTerm(clearFractionTerm(coefFracTerm))}(${stringifyExpression(clearExpression(expr))})=?`;
        const resultExpr = distributeExpressionByFractionTerm(coefFracTerm, expr);
        const simplifiedExpr = addSimilarFractionTermsInExpression(resultExpr);
        answer = stringifyExpression(simplifiedExpr);
    } else {
        return makeQuiz(getRandomInt(1, 4));
    }

    if (answer.startsWith('+')) answer = answer.slice(1);
    return { quiz, answer };
}
