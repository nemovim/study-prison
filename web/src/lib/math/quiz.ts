import type { QuizModule } from './types.js';

import { parse, simplify, simplifyCore, symbolicEqual, simplifyConstant } from 'mathjs';

import quizModule_5_1 from './quizzes/quiz_5_1.js';
import quizModule_6_1 from './quizzes/quiz_6_1.js';
import quizModule_6_2 from './quizzes/quiz_6_2.js';
import quizModule_7_3 from './quizzes/quiz_7_3.js';
import quizModule_7_4 from './quizzes/quiz_7_4.js';
import quizModule_7_5 from './quizzes/quiz_7_5.js';
import quizModule_7_6 from './quizzes/quiz_7_6.js';

export const quizModuleMap: Map<number, Map<number, QuizModule>> = new Map([
    [5, new Map([
        [1, quizModule_5_1]
    ])],
    [6, new Map([
        [1, quizModule_6_1],
        [2, quizModule_6_2]
    ])],
    [7, new Map([
        [3, quizModule_7_3],
        [4, quizModule_7_4],
        [5, quizModule_7_5],
        [6, quizModule_7_6]
    ])]
]);


export function getMaxSection(grade: number): number {
    return quizModuleMap.get(grade)?.size ?? 0;
}

export function getQuizModule(grade: number, section: number): QuizModule | null {
    return quizModuleMap.get(grade)?.get(section) ?? null;
}

export function isCorrect(userAnswer: string, quizAnswer: string): boolean {
    if (!userAnswer) return false;

    // 1. 미완성 입력 방어 (/, ^, -, + 등으로 끝나면 아직 판단하지 않음)
    const incompleteMarkers = ['/', '^', '-', '+'];
    if (incompleteMarkers.some(marker => userAnswer.trim().endsWith(marker))) {
        return false;
    }

    try {

        userAnswer = simplifyCore(userAnswer.replace(/([a-zA-Z])(?=[a-zA-Z])/g, '$1*')).toString();

        const isSimplified = userAnswer.split(/(?<![eE])[+-]/).length === simplify(userAnswer).toString().split(/(?<![eE])[+-]/).length;

        const isReduced = parse(userAnswer).toString() === simplifyConstant(userAnswer).toString() || parse(userAnswer).toString() === simplifyConstant(userAnswer, { exactFractions: false }).toString();

        const isEqual = symbolicEqual(parse(userAnswer), parse(quizAnswer))

        console.log(`[채점] Equal: ${isEqual}, Reduced: ${isReduced}, Simplified: ${isSimplified}`);

        const result = isReduced && isSimplified && isEqual;
        return result;

    } catch (e) {
        return false;
    }

}