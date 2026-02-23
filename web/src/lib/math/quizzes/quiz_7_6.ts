import { getRandomInt, getCleanTex, getQuizConfig, getRandomSymbol } from '../utils.js';
import type { QuizModule } from '../types.js';
import { fractionMath } from '../math.js';

const quizConfigs = {
    // [Level 1] 단항식과 수의 곱셈 (기초)
    // 예: 2x * 3, -4 * 2a
    1: { termCnt: 1, hasParenthesis: false, varCount: 1, denMax: 1, numMin: -9, numMax: 9 },

    // [Level 2] 단항식과 수의 나눗셈 (정수 결과)
    // 예: 6x / 2, -10a / 5
    2: { termCnt: 1, hasParenthesis: false, varCount: 1, denMax: 1, numMin: 2, numMax: 5 },

    // [Level 3] 동류항의 덧셈과 뺄셈 (가장 기본)
    // 예: 3x + 2x, 7a - 5a (상수항 없음)
    3: { termCnt: 2, hasParenthesis: false, varCount: 1, denMax: 1, numMin: 1, numMax: 10 },

    // [Level 4] 일차식의 덧셈과 뺄셈 (상수항 포함)
    // 예: 2x + 1 + 3x - 5 (괄호 없음)
    4: { termCnt: 4, hasParenthesis: false, varCount: 1, denMax: 1, numMin: -9, numMax: 9 },

    // [Level 5] 괄호가 있는 일차식의 가감 (분배법칙 기초)
    // 예: 2(x + 3) + (x - 1)
    5: { termCnt: 2, hasParenthesis: true, varCount: 1, denMax: 1, numMin: -5, numMax: 5 },

    // [Level 6] 일차식의 혼합 계산 (분수 계수 약간 포함)
    // 예: 3(x - 2) - 2(2x + 1)
    6: { termCnt: 2, hasParenthesis: true, varCount: 1, denMax: 2, numMin: -4, numMax: 4 },
} as const;

const maxLevel = Object.keys(quizConfigs).length;

/**
 * 중등 수학 표기 규칙 적용 (1x -> x, -1x -> -x)
 */
function formatTerm(coeffTex: string, variable: string): string {
    if (coeffTex === '0') return variable ? '' : '0';
    if (!variable) return coeffTex; 
    if (coeffTex === '1') return variable;
    if (coeffTex === '-1') return `-${variable}`;
    return `${coeffTex}${variable}`;
}

/**
 * 항 사이의 부호 연산자 처리
 */
function formatAddition(tex: string, isFirst: boolean): string {
    if (!tex || tex === '0') return '';
    if (isFirst) return tex;
    return tex.startsWith('-') ? ` - ${tex.substring(1)}` : ` + ${tex}`;
}

function makeQuiz(level: number): { quiz: string, answer: string } {
    const [activeLevel, config] = getQuizConfig(level, quizConfigs);
    const variable = getRandomSymbol(1, 2); // x 혹은 y 사용
    const allTerms: { coeff: string; varName: string; key: string }[] = [];
    const quizParts: string[] = [];

    // [Level 1 & 2] 단항식 곱셈/나눗셈 특화 로직
    if (activeLevel === 1) {
        const a = getRandomInt(config.numMin, config.numMax || 9);
        const b = getRandomInt(2, 9);
        if (a === 0) return makeQuiz(level);
        return { quiz: `${formatTerm(a.toString(), variable)} \\times ${b}`, answer: formatTerm((a * b).toString(), variable) };
    }
    
    if (activeLevel === 2) {
        const b = getRandomInt(2, 5);
        const ansNum = getRandomInt(-5, 5);
        if (ansNum === 0) return makeQuiz(level);
        const a = ansNum * b; // 항상 나누어 떨어지도록 설정
        return { quiz: `${formatTerm(a.toString(), variable)} \\div ${b}`, answer: formatTerm(ansNum.toString(), variable) };
    }

    // [Level 3~6] 일차식의 가감 및 혼합 계산
    const groupCount = config.hasParenthesis ? config.termCnt : 1;

    for (let g = 0; g < groupCount; g++) {
        if (config.hasParenthesis) {
            // --- 괄호가 있는 경우 (분배법칙) ---
            let outNum = getRandomInt(config.numMin, config.numMax);
            // Level 5에서는 괄호 앞이 +1인 경우도 포함하여 난이도 조절
            while (outNum === 0 || (activeLevel === 6 && outNum === 1)) outNum = getRandomInt(config.numMin, config.numMax);
            
            const inVarNum = getRandomInt(-5, 5);
            const inConstNum = getRandomInt(-5, 5);
            if (inVarNum === 0 && inConstNum === 0) { g--; continue; }

            allTerms.push({ coeff: `(${outNum}*${inVarNum})`, varName: variable, key: variable });
            allTerms.push({ coeff: `(${outNum}*${inConstNum})`, varName: '', key: 'const' });

            const inVarTex = formatTerm(inVarNum.toString(), variable);
            const inConstTex = inConstNum.toString();
            const innerExpr = `${inVarTex}${formatAddition(inConstTex, inVarTex === '')}`;
            
            if (outNum === 1) quizParts.push(`${g === 0 ? '' : ' + '}\\left(${innerExpr}\\right)`);
            else if (outNum === -1) quizParts.push(`${g === 0 ? '' : ' '}-\\left(${innerExpr}\\right)`);
            else quizParts.push(`${formatAddition(outNum.toString(), g === 0)}\\left(${innerExpr}\\right)`);
        } else {
            // --- 괄호가 없는 경우 (단순 나열) ---
            for (let i = 0; i < config.termCnt; i++) {
                const isVar = activeLevel === 3 ? true : (i % 2 === 0);
                const vName = isVar ? variable : '';
                let n = getRandomInt(config.numMin, config.numMax);
                while (n === 0) n = getRandomInt(config.numMin, config.numMax);
                
                allTerms.push({ coeff: `(${n}/1)`, varName: vName, key: vName || 'const' });
                quizParts.push(formatAddition(formatTerm(n.toString(), vName), quizParts.length === 0));
            }
        }
    }

    // 정답 계산 (동류항 끼리끼리)
    const keys = [variable, 'const'];
    let finalAnswerParts: string[] = [];
    keys.forEach(key => {
        const same = allTerms.filter(t => t.key === key);
        if (same.length === 0) return;
        const res = fractionMath.simplify(same.map(t => t.coeff).join('+')).toString();
        if (res !== '0') {
            const tex = getCleanTex(res, 'F');
            finalAnswerParts.push(key === 'const' ? tex : formatTerm(tex, variable));
        }
    });

    const answer = finalAnswerParts.length === 0 ? '0' : finalAnswerParts.reduce((acc, cur, idx) => {
        if (idx === 0) return cur;
        return cur.startsWith('-') ? acc + cur : acc + '+' + cur;
    }, '');

    return { quiz: quizParts.join('').trim(), answer };
}

const quizModule: QuizModule = {
    grade: 7,
    section: 6,
    name: '문자와 식 (일차식의 계산)',
    maxLevel,
    makeQuiz,
};

export default quizModule;