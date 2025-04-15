import {
    addSimilarTerms,
    distributeByExpression,
    distributeByTerm,
    getRandomExpression,
    getRandomInt,
    stringifyExpression,
    type Term,
} from './utils.js';

export function getSectionName(section: number): string {
    if (section === 1) return '소인수분해';
    else if (section === 2) return '최대공약수와 최소공배수';
    else if (section === 3) return '정수와 유리수의 계산';
    else if (section === 4) return '문자를 사용한 식';
    else if (section === 5) return '다항식의 계산';
    else if (section === 6) return '일차방정식의 풀이';
    else return '메인'
}

export function getMaxLevel(section: number): number {
    if (section === 3) return 5;
    else if (section === 5) return 8;
    else return 0;
}

export function makeQuizSection3(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    if (level === 1) {
        const expr = getRandomExpression(2, -5, 5, 0, 0);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 2) {
        const expr = getRandomExpression(2, -25, 15, 0, 0);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 3) {
        const expr = getRandomExpression(3, -10, 5, 0, 0);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 4) {
        const expr = getRandomExpression(2, -5, 5, 0, 0);
        const term = expr.pop() as Term;

        quiz = `(${stringifyExpression([term], true)})×(${stringifyExpression(expr, true)})=?`;
        answer = stringifyExpression(
            distributeByTerm(term, addSimilarTerms(expr))
        );
    } else if (level === 5) {
        const expr1 = getRandomExpression(2, -5, 5, 0, 0);
        const expr2 = getRandomExpression(2, -5, 5, 0, 0);

        quiz = `(${stringifyExpression(expr1, true)})×(${stringifyExpression(expr2, true)})=?`;
        answer = stringifyExpression(
            distributeByExpression(addSimilarTerms(expr1), addSimilarTerms(expr2))
        );
    } else {
        return makeQuizSection3(getRandomInt(1, 5));
    }

    return { quiz, answer };
}

export function makeQuizSection5(level: number): { quiz: string, answer: string } {
    let quiz = '', answer = '';

    if (level === 1) {
        // x + 2x
        const expr = getRandomExpression(2, -5, 5, 1, 1);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 2) {
        // 2x + 3y - 5x
        const expr = getRandomExpression(4, -3, 3, 0, 2);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 3) {
        // 2x - 5x^2
        const expr = getRandomExpression(4, -3, 3, 0, 1, 2);

        quiz = stringifyExpression(expr, true) + '=?';
        answer = stringifyExpression(addSimilarTerms(expr));
    } else if (level === 4) {
        // 2(3y)
        const expr = getRandomExpression(2, -6, 4, 0, 2);
        const coefTerm = expr.pop() as Term;

        quiz = `${stringifyExpression([coefTerm], true)}(${stringifyExpression(expr, true)})=?`;
        answer = stringifyExpression(
            distributeByTerm(coefTerm, addSimilarTerms(expr))
        );
    } else if (level === 5) {
        // 2x^2(3x)
        const expr = getRandomExpression(2, -6, 4, 0, 1, 2);
        const coefTerm = expr.pop() as Term;

        quiz = `${stringifyExpression([coefTerm], true)}(${stringifyExpression(expr, true)})=?`;
        answer = stringifyExpression(
            distributeByTerm(coefTerm, addSimilarTerms(expr))
        );
    } else if (level === 6) {
        // 2x(3y + 4x)
        const expr = getRandomExpression(3, -3, 3, 0, 1);
        const coefTerm = expr.pop() as Term;

        quiz = `${stringifyExpression([coefTerm], true)}(${stringifyExpression(expr, true)})=?`;
        answer = stringifyExpression(
            distributeByTerm(coefTerm, addSimilarTerms(expr))
        );
    } else if (level == 7) {
        // 2x(3y + 4x^2)
        const expr = getRandomExpression(3, -3, 3, 0, 2, 2);
        const coefTerm = expr.pop() as Term;

        quiz = `${stringifyExpression([coefTerm], true)}(${stringifyExpression(expr, true)})=?`;
        answer = stringifyExpression(
            distributeByTerm(coefTerm, addSimilarTerms(expr))
        );
    } else if (level == 8) {
        // (2x+3)(3x^2 + 4x)
        const expr1 = getRandomExpression(2, -3, 3, 0, 1, 2);
        const expr2 = getRandomExpression(2, -3, 3, 0, 1, 2);

        quiz = `(${stringifyExpression(expr1, true)})(${stringifyExpression(expr2, true)})=?`;
        answer = stringifyExpression(
            addSimilarTerms(distributeByExpression(addSimilarTerms(expr1), addSimilarTerms(expr2)))
        );
    } else {
        return makeQuizSection5(getRandomInt(1, 8));
    }

    return { quiz, answer };
}

export function makeQuiz(level: number, section: number): { quiz: string, answer: string } {
    if (section === 3) return makeQuizSection3(level);
    else if (section === 5) return makeQuizSection5(level);
    else return { quiz: '', answer: '' };

    // } else if (level === 9) {
    //     let expr1 = getRandomExpression(3, -3, 3, 0, 2);
    //     let expr2 = getRandomExpression(3, -3, 3, 0, 2);
    //     const coefTerm1 = expr1.pop() as Term;
    //     const coefTerm2 = expr2.pop() as Term;

    //     if (aCoef2 >= 0) {
    //         quiz = `${stringifyExpression([aCoef1], [xCoef1])}(${stringifyExpression(
    //             aArr1,
    //             xArr1
    //         )})+${stringifyExpression([aCoef2], [xCoef2])}(${stringifyExpression(aArr2, xArr2)})=?`;
    //     } else {
    //         quiz = `${stringifyExpression([aCoef1], [xCoef1])}(${stringifyExpression(
    //             aArr1,
    //             xArr1
    //         )})${stringifyExpression([aCoef2], [xCoef2])}(${stringifyExpression(aArr2, xArr2)})=?`;
    //     }

    //     [aArr1, xArr1] = distributeByTerm(
    //         aCoef1,
    //         xCoef1,
    //         ...addSimilarTerms(aArr1, xArr1)
    //     );
    //     [aArr2, xArr2] = distributeByTerm(
    //         aCoef2,
    //         xCoef2,
    //         ...addSimilarTerms(aArr2, xArr2)
    //     );

    //     let aArr = [...aArr1, ...aArr2];
    //     let xArr = [...xArr1, ...xArr2];

    //     answer = stringifyExpression(...addSimilarTerms(aArr, xArr));
    // } else if (level === 10) {
    //     let [aLeft, xLeft] = getRandomExpression(2, -3, 3, 1, 1);
    //     let [aRight, xRight] = getRandomExpression(1, -3, 3, 0, 0);

    //     while (stringifyExpression(aLeft, xLeft) === '0') {
    //         [aLeft, xLeft] = getRandomExpression(2, -3, 3, 1, 1);
    //     }

    //     quiz = `${stringifyExpression(aLeft, xLeft)}=${stringifyExpression(aRight, xRight)}, x=?`;
    //     let [a, b] = addSimilarTerms(aLeft, xLeft);

    //     if (aRight === 0) {
    //         answer = 0;
    //     } else {
    //         if (aRight * a < 0) {
    //             answer = `-${Math.abs(aRight)}/${Math.abs(a)}`;
    //         } else {
    //             answer = `${Math.abs(aRight)}/${Math.abs(a)}`;
    //         }
    //     }
}