import { getRandomInt, getCleanTex, getQuizConfig, getRandomSymbol } from '../utils.js';
import type { QuizModule } from '../types.js';
import { fractionMath } from '../math.js';

const quizConfigs = {
    // [Level 1] 단항식과 수의 곱/나눗셈
    // 3 * 2x, -8a / 4
    1: { termCnt: 1, hasParenthesis: false, varCount: 1, denMax: 1, numMin: -9, numMax: 9 },

    // [Level 2] 동류항의 가감 (문자 1개)
    // 5x + 2x, 3x - 7x
    2: { termCnt: 2, hasParenthesis: false, varCount: 1, denMax: 1, numMin: 1, numMax: 12 },

    // [Level 3] 일차식의 가감 (항 3개 = 문자1개 + 상수항 자연 포함)
    // 2x + 5 - 4x  -> 정답: -2x + 5
    3: { termCnt: 3, hasParenthesis: false, varCount: 1, denMax: 1, numMin: -9, numMax: 9 },

    // [Level 4] 문자 2개 혼합 가감 (항 4개 = 문자2개 + 상수항 자연 포함)
    // 3x - 2y + 5 + x  -> 정답: 4x - 2y + 5
    // *여기서 상수항이 하나쯤 끼어들면 딱이죠.
    4: { termCnt: 4, hasParenthesis: false, varCount: 2, denMax: 1, numMin: -8, numMax: 8 },

    // [Level 5] 괄호 1개 기초 (분배법칙)
    // 2(x - 3), -3(2a + 4)
    5: { termCnt: 1, hasParenthesis: true, parenCount: 1, varCount: 1, denMax: 1, numMin: -6, numMax: 6 },

    // [Level 6] 괄호 2개 혼합 (문자 1개)
    // 3(x + 2) + 2(x - 1)
    6: { termCnt: 2, hasParenthesis: true, parenCount: 2, varCount: 1, denMax: 1, numMin: -5, numMax: 5 },

    // [Level 7] 분수 계수 약분형
    // 1/2(4x - 8), (6a + 9) / 3
    7: { termCnt: 1, hasParenthesis: true, parenCount: 1, varCount: 1, denMax: 4, numMin: -8, numMax: 8 },

    // [Level 8] 문자 2개 + 괄호 혼합 (최종)
    // 2(x - 3y + 1) - (2x + y)
    8: { termCnt: 2, hasParenthesis: true, parenCount: 2, varCount: 2, denMax: 1, numMin: -4, numMax: 4 },
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
    
    // 1. 사용할 문자들 결정 (varCount에 따라 x, y 등 선택)
    // varCount가 2면 ['x', 'y'], 1이면 ['x'] (또는 랜덤 한 개)
    const selectedVars: string[] = [];
    if (config.varCount === 1) {
        selectedVars.push(getRandomSymbol(1, 4)); // x, y, z, a 중 하나
    } else {
        selectedVars.push('x', 'y'); // 문자 2개 레벨은 표준 x, y 사용
    }
    
    const quizParts: string[] = [];
    const allTerms: { coeff: string; key: string }[] = [];

    // --- [Case 1] 괄호 없는 단순 나열 (Level 1~4) ---
    if (!config.hasParenthesis) {
        if (activeLevel === 1) {
            const v = selectedVars[0];
            const a = getRandomInt(config.numMin, config.numMax);
            const b = getRandomInt(2, 9);
            return { quiz: `${formatTerm(a.toString(), v)} \\times ${b}`, answer: formatTerm((a * b).toString(), v) };
        }
        if (activeLevel === 2) {
            const v = selectedVars[0];
            const b = getRandomInt(2, 5);
            const ansNum = getRandomInt(-5, 5);
            return { quiz: `${formatTerm((ansNum * b).toString(), v)} \\div ${b}`, answer: formatTerm(ansNum.toString(), v) };
        }

        // Level 3, 4: 항들을 섞어서 생성
        const pool = [...selectedVars, '']; // ''은 상수항(const)을 의미
        for (let i = 0; i < config.termCnt; i++) {
            // 최소한 지정된 문자들은 한 번씩 나오게 보장
            const type = i < selectedVars.length ? selectedVars[i] : pool[getRandomInt(0, pool.length - 1)];
            const n = getRandomInt(config.numMin, config.numMax);
            
            allTerms.push({ coeff: n.toString(), key: type || 'const' });
            quizParts.push(formatAddition(formatTerm(n.toString(), type), quizParts.length === 0));
        }
    } 
    // --- [Case 2] 괄호가 있는 경우 (Level 5~8) ---
    else {
        const groupCount = config.parenCount || 1;
        for (let g = 0; g < groupCount; g++) {
            let outNumStr: string;
            
            // Level 7: 분수 계수 (약분되는 형태 유도)
            if (activeLevel === 7) {
                const den = getRandomInt(2, config.denMax || 4);
                outNumStr = `1/${den}`;
            } else {
                let n = getRandomInt(config.numMin, config.numMax);
                // Level 6 이상에서 첫 항이 1이면 심심하므로 -1로 바꾸거나 재추출
                if (activeLevel >= 6 && n === 1 && g === 0) n = -1;
                outNumStr = n.toString();
            }

            // 괄호 안 구성: 문자(들) + 상수항 1개
            const innerTerms: { n: number, v: string }[] = [];
            selectedVars.forEach(v => innerTerms.push({ n: getRandomInt(-5, 5), v }));
            innerTerms.push({ n: getRandomInt(-5, 5), v: '' }); // 상수항 추가

            // Level 7 약분 보정: 괄호 안의 숫자를 분모의 배수로
            if (activeLevel === 7) {
                const den = parseInt(outNumStr.split('/')[1]);
                innerTerms.forEach(t => t.n *= den);
            }

            // 괄호 수식 텍스트 생성
            const innerTex = innerTerms
                .map((t, idx) => formatAddition(formatTerm(t.n.toString(), t.v), idx === 0))
                .join('');
            
            const outTex = outNumStr === '1' ? '' : (outNumStr === '-1' ? '-' : getCleanTex(outNumStr, 'F'));
            quizParts.push(`${formatAddition(outTex, g === 0)}\\left(${innerTex}\\right)`);

            // 정답 계산 데이터 저장
            innerTerms.forEach(t => {
                allTerms.push({ coeff: `(${outNumStr}*${t.n})`, key: t.v || 'const' });
            });
        }
    }

    // --- 정답 합산 (x항, y항, 상수항 순서로 정리) ---
    const finalKeys = [...selectedVars, 'const'];
    let answerParts: string[] = [];
    
    finalKeys.forEach(key => {
        const sameType = allTerms.filter(t => t.key === key);
        if (sameType.length === 0) return;
        
        const res = fractionMath.simplify(sameType.map(t => t.coeff).join('+')).toString();
        if (res !== '0') {
            const tex = getCleanTex(res, 'F');
            answerParts.push(key === 'const' ? tex : formatTerm(tex, key));
        }
    });

    const answer = answerParts.length === 0 ? '0' : answerParts.reduce((acc, cur, idx) => {
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