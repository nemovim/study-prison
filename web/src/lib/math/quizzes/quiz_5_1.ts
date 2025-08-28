import {
    getRandomFractionTerm,
    getRandomInt,
    stringifyFractionTerm,
    type GenerationConfig,
    multiplyFractionTerms,
    clearFractionTerm,
    addSimilarFractionTerms
} from '../utils.js';

// 분수의 덧셈
export default function makeQuiz(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    const getQuizConfig = (level: number): GenerationConfig => {
        const baseConfig: GenerationConfig = {
            symbolMin: 0,
            symbolMax: 0,
            symbolPowerMin: 0,
            symbolPowerMax: 0,
            symbolCnt: 0,
            allowNumericFraction: true
        };

        switch (level) {
            case 1: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: 1,
                numIntMax: 1,
                denIntMin: 2,
                denIntMax: 8,
            };
            case 2: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: 1,
                numIntMax: 2,
                denIntMin: 2,
                denIntMax: 6,
            };
            case 3: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: 1,
                numIntMax: 6,
                denIntMin: 1,
                denIntMax: 3,
            };
            case 4: return {
                ...baseConfig,
                termCnt: 2,
                numIntMin: 1,
                numIntMax: 6,
                denIntMin: 1,
                denIntMax: 8,
            };
            case 5: return {
                ...baseConfig,
                termCnt: 3,
                numIntMin: 1,
                numIntMax: 4,
                denIntMin: 1,
                denIntMax: 4,
            };
            default: return getQuizConfig(getRandomInt(1, 5));
        }
    };

    const config: GenerationConfig = getQuizConfig(level);
    const fracTerm1 = getRandomFractionTerm(config);
    // config.numIntMax = 1;
    // if (level === 1) {
    //     config.denIntMin = 1;
    //     config.denIntMax = 1;
    // } else if (level === 2) {
    //     config.numIntMax = 1;
    // } else {
    //     return makeQuiz(getRandomInt(1, 4));
    // }
    const fracTerm2 = getRandomFractionTerm(config);

    quiz = `${stringifyFractionTerm(fracTerm1).slice(1)}+${stringifyFractionTerm(fracTerm2).slice(1)}=?`;
    const result = addSimilarFractionTerms(fracTerm1, fracTerm2);
    answer = stringifyFractionTerm(clearFractionTerm(result));
    if (answer.startsWith('+')) answer = answer.slice(1);

    return { quiz, answer };
}
