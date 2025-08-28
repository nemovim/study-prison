import makeQuiz_5_1 from './quizzes/quiz_5_1.js';
import makeQuiz_6_1 from './quizzes/quiz_6_1.js';
import makeQuiz_6_2 from './quizzes/quiz_6_2.js';
import makeQuiz_7_3 from './quizzes/quiz_7_3.js';
import makeQuiz_7_4 from './quizzes/quiz_7_4.js';
import makeQuiz_7_6 from './quizzes/quiz_7_6.js';
import makeQuiz_7_7 from './quizzes/quiz_7_7.js';

export function getSectionName(grade: number, section: number): string {
    if (grade === 5) {
        if (section === 1) return '분수의 덧셈';
    } else if (grade === 6) {
        if (section === 1) return '분수의 곱셈';
        else if (section === 2) return '분수의 나눗셈';
    } else if (grade === 7) {
        if (section === 1) return '소인수분해';
        else if (section === 2) return '최대공약수와 최소공배수';
        else if (section === 3) return '정수와 유리수의 덧셈과 뺄셈';
        else if (section === 4) return '정수와 유리수의 곱셈';
        else if (section === 5) return '문자를 사용한 식';
        else if (section === 6) return '다항식의 덧셈과 뺄셈';
        else if (section === 7) return '다항식의 곱셈';
        else if (section === 8) return '일차방정식의 풀이';
    }
    return '메인';
}

export function getMaxSection(grade: number): number {
    if (grade === 5) return 1;
    if (grade === 6) return 2;
    else if (grade === 7) return 8;
    return 0;
}

export function getMaxLevel(grade: number, section: number): number {
    if (grade === 5) {
        if (section === 1) return 5;  // 분수의 덧셈
    }else if (grade === 6) {
        if (section === 1) return 3;
        else if (section === 2) return 3;
    }
    else if (grade === 7) {
        if (section === 3) return 7;  // 정수와 유리수의 덧셈과 뺄셈
        else if (section === 4) return 4;  // 정수와 유리수의 곱셈
        else if (section === 6) return 5;  // 다항식의 덧셈과 뺄셈
        else if (section === 7) return 4;  // 다항식의 곱셈
    }
    return 0;
}

export function makeQuiz(level: number, grade: number, section: number): { quiz: string, answer: string } {
    if (grade === 5 && section === 1) {
        return makeQuiz_5_1(level);
    } else if (grade === 6 && section === 1) {
        return makeQuiz_6_1(level);
    } else if (grade === 6 && section === 2) {
        return makeQuiz_6_2(level);
    } else if (grade === 7 && section === 3) {
        return makeQuiz_7_3(level);
    } else if (grade === 7 && section === 4) {
        return makeQuiz_7_4(level);
    } else if (grade === 7 && section === 6) {
        return makeQuiz_7_6(level);
    } else if (grade === 7 && section === 7) {
        return makeQuiz_7_7(level);
    }
    return { quiz: '', answer: '' };
}