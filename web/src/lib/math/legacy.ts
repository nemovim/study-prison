//-----------------------------------------------------
// 타입 정의
//-----------------------------------------------------
export type NumericTerm = Map<number, number>;
export type SymbolicTerm = Map<string, number>;
export type Term = Map<number | string, number>;
export type FractionTerm = { num: Term, den: Term }
export type Expression = FractionTerm[]
export type FractionExpression = { num: Expression, den: Expression }
export type TermArr = [number | string, number][]
export type FractionTermArr = [TermArr, TermArr]
export type ExpressionArr = FractionTermArr[]

//-----------------------------------------------------
// 기본 유틸리티 함수
//-----------------------------------------------------

export function primeFactorizeFromNumber(n: number): NumericTerm {
    // console.log(`primeFactorizeFromNumber: ${n}`);
    if (n < 0) {
        const primeTerm = primeFactorizeFromNumber(-n);
        primeTerm.set(-1, 1);
        return primeTerm;
    }
    if (n === 0) return getZeroTerm();
    if (n === 1) return getOneTerm();

    const primeTerm = new Map<number, number>();
    for (let i = 2; i * i <= n; i++) {
        while (n % i === 0) {
            primeTerm.set(i, (primeTerm.get(i) || 0) + 1);
            n /= i
        }
    }
    if (n > 1)
        primeTerm.set(n, (primeTerm.get(n) || 0) + 1);
    return primeTerm;
}

/**
 * 항의 숫자 부분을 계산하는 함수
 * @param term 계산할 항
 * @returns 계산된 숫자 값
 */
export function calcNumericTermInTerm(term: Term): number {
    let result = 1;
    term.forEach((power, base) => {
        if (typeof base === 'number')
            result *= base ** power;
    })
    return result;
}

/**
 * 항에서 숫자 부분만 추출하는 함수
 * @param term 원본 항
 * @returns 숫자 부분만 포함한 항
 */
export function getNumericTermFromTerm(term: Term): NumericTerm {
    const numericTerm: NumericTerm = new Map();
    term.forEach((power, base) => {
        if (typeof base === 'number') numericTerm.set(base, power);
    });
    return numericTerm;
}

/**
 * 항에서 기호 부분만 추출하는 함수
 * @param term 원본 항
 * @returns 기호 부분만 포함한 항
 */
export function getSymbolicTermFromTerm(term: Term): SymbolicTerm {
    const symbolicTerm: SymbolicTerm = new Map();
    term.forEach((power, base) => {
        if (typeof base === 'string') symbolicTerm.set(base, power);
    });
    return symbolicTerm;
}

//-----------------------------------------------------
// 기본 항 생성 함수
//-----------------------------------------------------

/**
 * 0 항을 반환하는 함수
 * @returns 0을 나타내는 항
 */
export function getZeroTerm(): NumericTerm {
    return new Map([[0, 1]]);
}

/**
 * 1 항을 반환하는 함수
 * @returns 1을 나타내는 항
 */
export function getOneTerm(): NumericTerm {
    return new Map([[1, 1]]);
}

/**
 * 0 분수항을 반환하는 함수
 * @returns 0을 나타내는 분수항
 */
export function getZeroFractionTerm(): FractionTerm {
    return { num: getZeroTerm(), den: getOneTerm() };
}

/**
 * 1 분수항을 반환하는 함수
 * @returns 1을 나타내는 분수항
 */
export function getOneFractionTerm(): FractionTerm {
    return { num: getOneTerm(), den: getOneTerm() };
}

//-----------------------------------------------------
// 항 검사 함수
//-----------------------------------------------------

export function isValidTerm(term: Term): boolean {
    return term.size > 0;
}

export function isValidFractionTerm(fracTerm: FractionTerm): boolean {
    return isValidTerm(fracTerm.num) && isValidTerm(fracTerm.den);
}

export function isValidExpression(expr: Expression): boolean {
    return expr.length > 0 && expr.every(isValidFractionTerm);
}

/**
 * 항이 0인지 확인하는 함수
 * @param term 확인할 항
 * @returns 0이면 true, 아니면 false
 */
export function isZeroTerm(term: Term): boolean {
    if (!isValidTerm(term)) return false;
    if (calcNumericTermInTerm(term) !== 0) return false;
    return true;
}

export function isZeroFractionTerm(fracTerm: FractionTerm): boolean {
    if (!isValidFractionTerm(fracTerm)) return false;
    if (calcNumericTermInTerm(fracTerm.num) !== 0) return false;
    return true;
}

/**
 * 항이 1인지 확인하는 함수
 * @param term 확인할 항
 * @returns 1이면 true, 아니면 false
 */
export function isOneTerm(term: Term): boolean {
    if (!isValidTerm(term)) return false;
    if (calcNumericTermInTerm(term) !== 1) return false;

    let isOne = true;
    term.forEach((power, base) => {
        // 문자 인수는 지수가 0이어야 함 (x^0 = 1)
        if (typeof base === 'string' && (power !== 0)) isOne = false;
    });
    return isOne;
}

export function isOneFractionTerm(fracTerm: FractionTerm): boolean {
    if (!isValidFractionTerm(fracTerm)) return false;
    return isOneTerm(fracTerm.num) && isOneTerm(fracTerm.den);
}

//-----------------------------------------------------
// 항 연산 함수
//-----------------------------------------------------

/**
 * 두 항의 최대공약수(GCD)를 구하는 함수
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 두 항의 최대공약수 항
 */
export function getGCDTerm(term1: Term, term2: Term): Term {
    const GCDTerm: Term = new Map();
    term1.forEach((power1, base) => {
        if (!term2.has(base)) return;
        const power2 = term2.get(base) || 0;
        GCDTerm.set(base, Math.min(power1, power2));
    })
    if (GCDTerm.size === 0) return getZeroTerm();
    else return GCDTerm;
}

/**
 * 두 항의 최소공배수(LCM)를 구하는 함수
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 두 항의 최소공배수 항
 */
export function getLCMTerm(term1: Term, term2: Term): Term {
    const LCMTerm: Term = new Map(term1);
    term2.forEach((power2, base) => {
        if (!LCMTerm.has(base)) {
            LCMTerm.set(base, power2);
        } else {
            const power1 = LCMTerm.get(base) || 0;
            LCMTerm.set(base, Math.max(power1, power2));
        }
    })
    return LCMTerm;
}

// /**
//  * 수식에서 0인 항을 제거하는 함수
//  * @param expr 원본 수식
//  * @returns 0이 아닌 항만 포함한 수식
//  */
// export function removeZeroTermsInExpression(expr: Expression): Expression {
//     const newExpr = expr.filter(fracTerm => !isZeroFractionTerm(fracTerm));
//     if (newExpr.length === 0) return [getZeroFractionTerm()];
//     else return newExpr;
// }

//-----------------------------------------------------
// 기본 산술 연산 함수
//-----------------------------------------------------

/**
 * 두 항을 곱하는 함수
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 곱한 결과 항
 */
export function multiplyTerms(term1: Term, term2: Term): Term {
    const resultTerm: Term = new Map(term1);
    term2.forEach((power2, base) => {
        resultTerm.set(base, (resultTerm.get(base) || 0) + power2);
    });
    return resultTerm;
}

/**
 * 두 분수항을 곱하는 함수
 * @param fracTerm1 첫 번째 분수항
 * @param fracTerm2 두 번째 분수항
 * @returns 곱한 결과 분수항
 */
export function multiplyFractionTerms(fracTerm1: FractionTerm, fracTerm2: FractionTerm): FractionTerm {
    return {
        num: multiplyTerms(fracTerm1.num, fracTerm2.num),
        den: multiplyTerms(fracTerm1.den, fracTerm2.den)
    };
}

/**
 * 두 항을 나누는 함수
 * @param term1 나누어질 항
 * @param term2 나누는 항
 * @returns 나눌 결과 항
 * @throws 0으로 나누려고 할 때 예외 발생
 */
export function divideTerms(term1: Term, term2: Term): Term {
    // 0으로 나누기 처리
    if (isZeroTerm(term2)) {
        throw new Error("Division by zero");
    }

    const resultTerm: Term = new Map(term1);
    term2.forEach((power, base) => {
        resultTerm.set(base, (resultTerm.get(base) || 0) - power);
    });
    return resultTerm;
}

/**
 * 두 분수항을 나누는 함수
 * @param fracTerm1 나누어질 분수항
 * @param fracTerm2 나누는 분수항
 * @returns 나눌 결과 분수항
 */
export function divideFractionTerms(fracTerm1: FractionTerm, fracTerm2: FractionTerm): FractionTerm {
    // 가정 1: 분모에는 0이 없다
    if (isZeroTerm(fracTerm2.num)) {
        throw new Error("Division by zero");
    }

    // 일반적인 분수 나누기 연산
    return {
        num: multiplyTerms(fracTerm1.num, fracTerm2.den),
        den: multiplyTerms(fracTerm1.den, fracTerm2.num)
    };
}

//-----------------------------------------------------
// 항 변환 함수
//-----------------------------------------------------

/**
 * 항을 분수항으로 변환하는 함수
 * 음수 지수를 가진 인수는 분모로 이동
 * @param term 변환할 항
 * @returns 변환된 분수항
 */
export function convertTermToFractionTerm(term: Term): FractionTerm {
    let numTerm: Term = new Map();
    let denTerm: Term = new Map();

    term.forEach((power, base) => {
        if (power < 0) {
            denTerm.set(base, -power);
        } else {
            // Allow zero power
            numTerm.set(base, power);
        }
    });

    // 분자나 분모가 비어있으면 1로 처리
    if (numTerm.size === 0) {
        numTerm = getOneTerm();
    }
    if (denTerm.size === 0) {
        denTerm = getOneTerm();
    }

    return {
        num: numTerm,
        den: denTerm,
    };
}

/**
 * 분수항을 일반 항으로 변환하는 함수
 * @param fracTerm 변환할 분수항
 * @returns 변환된 항
 */
export function convertFractionTermToTerm(fracTerm: FractionTerm): Term {
    return divideTerms(fracTerm.num, fracTerm.den);
}

//-----------------------------------------------------
// 항 정규화 함수
//-----------------------------------------------------

/**
 * 항의 숫자 부분을 정규화 하는 함수
 * @param numericTerm 정규화할 항의 숫자 부분
 * @returns 정규화된 항의 숫자 부분
 */
function clearNumericTerm(numericTerm: Term): Term {
    const value = calcNumericTermInTerm(numericTerm);
    if (value%1 !== 0) {
        const newTerm: Term = new Map([[value, 1]]);
        return newTerm;
    } else {
        const newTerm: Term = primeFactorizeFromNumber(value);
        return newTerm;
    }
}

/**
 * 항의 기호 부분을 정규화 하는 함수
 * @param symbolicTerm 정규화할 항의 기호 부분
 * @returns 정규화된 항의 기호 부분
 */
function clearSymbolicTerm(symbolicTerm: Term): Term {
    const newTerm: Term = new Map();
    symbolicTerm.forEach((power, base) => {
        if (power === 0) return;
        newTerm.set(base, power);
    });
    return newTerm;
}

/**
 * 항을 정리하는 함수
 * 1. 0인 지수를 가진 인수 제거
 * 2. 음수 인수를 양수로 변환하고 -1 인수 추가
 * 3. 항상 1 또는 -1을 계수로 포함하도록 정규화
 * @param term 정리할 항
 * @returns 정리된 항
 */
export function clearTerm(term: Term): Term {
    // 0인 항은 즉시 0 반환
    if (isZeroTerm(term)) return getZeroTerm();

    // 숫자 항과 기호 항 분리
    const numericTerm = getNumericTermFromTerm(term);
    const symbolicTerm = getSymbolicTermFromTerm(term);

    // 정규화된 항 생성
    const newTerm = new Map([...clearNumericTerm(numericTerm), ...clearSymbolicTerm(symbolicTerm)]);

    return newTerm;
}

// 분수 약분 // 필요 없을지도...
export function simplifyFractionTerm(fractionTerm: FractionTerm): FractionTerm {
    // const GCDTerm = getGCDTerm(fractionTerm.num, fractionTerm.den);
    // return {
    //     num: divideTerms(fractionTerm.num, GCDTerm),
    //     den: divideTerms(fractionTerm.den, GCDTerm),
    // }
    return convertTermToFractionTerm(convertFractionTermToTerm(fractionTerm));
}

// Assumption: The fraction term is already cleared
export function clearSignOfFractionTerm(fracTerm: FractionTerm): FractionTerm {
    // 분모에 -1이 있으면 분자에 -1 추가
    if (fracTerm.den.has(-1)) {
        fracTerm.den.delete(-1);
        fracTerm.den.set(1, 1);

        if (fracTerm.num.has(-1)) {
            fracTerm.num.delete(-1);
            fracTerm.num.set(1, 1);
        } else {
            fracTerm.num.delete(1);
            fracTerm.num.set(-1, 1);
        }
    }

    return fracTerm;
}

/**
 * 분수항을 정리하는 함수
 * 분자와 분모의 항을 각각 정리
 * @param fracTerm 정리할 분수항
 * @returns 정리된 분수항
 */
export function clearFractionTerm(fracTerm: FractionTerm): FractionTerm {
    // 분자가 0이면 0항 반환
    if (isZeroFractionTerm(fracTerm)) {
        return getZeroFractionTerm();
    }

    // 분자와 분모 분리 처리
    const numTerm = clearTerm(fracTerm.num);
    const denTerm = clearTerm(fracTerm.den);


    return clearSignOfFractionTerm(simplifyFractionTerm({
        num: numTerm,
        den: denTerm
    }));
}

/**
 * 수식을 정리하는 함수
 * 수식의 모든 분수항을 정리
 * @param expr 정리할 수식
 * @returns 정리된 수식
 */
export function clearExpression(expr: Expression): Expression {
    const newExpr = expr.map(fracTerm => clearFractionTerm(fracTerm)).filter(fracTerm => !isZeroTerm(fracTerm.num));
    if (newExpr.length === 0) return [getZeroFractionTerm()];
    return newExpr;
}

//-----------------------------------------------------
// 항 유사성 검사 함수
//-----------------------------------------------------

/**
 * 두 항이 유사한지 검사하는 함수 (기호 부분이 동일한지 확인)
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 유사하면 true, 아니면 false
 */
export function areSimilarTerms(term1: Term, term2: Term): boolean {
    const symbolicFactorArr1 = convertTermToArr(getSymbolicTermFromTerm(term1));
    const symbolicFactorArr2 = convertTermToArr(getSymbolicTermFromTerm(term2));

    if (symbolicFactorArr1.length !== symbolicFactorArr2.length) return false;

    for (let i = 0; i < symbolicFactorArr1.length; i++) {
        if (symbolicFactorArr1[i][0] !== symbolicFactorArr2[i][0]) return false;
        if (symbolicFactorArr1[i][1] !== symbolicFactorArr2[i][1]) return false;
    }

    return true;
}

/**
 * 두 분수항이 유사한지 검사하는 함수
 * @param fracTerm1 첫 번째 분수항
 * @param fracTerm2 두 번째 분수항
 * @returns 유사하면 true, 아니면 false
 */
export function areSimilarFractionTerms(fracTerm1: FractionTerm, fracTerm2: FractionTerm): boolean {
    return areSimilarTerms(convertFractionTermToTerm(fracTerm1), convertFractionTermToTerm(fracTerm2));
}

//-----------------------------------------------------
// 항 덧셈 함수
//-----------------------------------------------------

/**
 * 유사한 두 항을 더하는 함수
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 더한 결과 항
 */
export function addSimilarTerms(term1: Term, term2: Term): Term {

    // 동류항 확인
    if (!areSimilarTerms(term1, term2)) throw new Error("Terms are not similar");

    // 숫자 부분 계산
    const numericTerm1: NumericTerm = getNumericTermFromTerm(term1);
    const numericTerm2: NumericTerm = getNumericTermFromTerm(term2);
    const numericSum: number = calcNumericTermInTerm(numericTerm1) + calcNumericTermInTerm(numericTerm2);


    // 계수가 0이면 0 반환
    if (numericSum === 0) {
        return getZeroTerm();
    }

    // 가정 3: 덧셈할 때 numeric factor의 지수는 음수가 아니다
    // 가정 7: 정리 후 모든 항은 1/-1을 가진다. 이외의 숫자 인수는 모두 양수이다.

    // 숫자 부분 분해
    const newNumericTerm: NumericTerm = numericSum % 1 === 0 ? primeFactorizeFromNumber(numericSum) : new Map([[parseFloat(numericSum.toFixed(10)), 1]]);

    // 문자 부분 가져오기 (두 항의 문자 부분은 동일)
    const newSymbolicTerm: SymbolicTerm = getSymbolicTermFromTerm(term1);

    // 결과 항 생성
    return new Map<number | string, number>([...newNumericTerm, ...newSymbolicTerm]);
}

/**
 * 유사한 두 분수항을 더하는 함수
 * @param fracTerm1 첫 번째 분수항
 * @param fracTerm2 두 번째 분수항
 * @returns 더한 결과 분수항
 */
export function addSimilarFractionTerms(fracTerm1: FractionTerm, fracTerm2: FractionTerm): FractionTerm {
    // 분모의 최소공배수 구하기
    const LCMTerm = getLCMTerm(fracTerm1.den, fracTerm2.den);

    // 분자와 분모를 같은 분모로 만들기 위한 승수
    const multiplier1 = divideTerms(LCMTerm, fracTerm1.den);
    const multiplier2 = divideTerms(LCMTerm, fracTerm2.den);

    // 분자를 각각 승수한 후 더하기
    const newNumeratorTerm = addSimilarTerms(
        multiplyTerms(multiplier1, fracTerm1.num),
        multiplyTerms(multiplier2, fracTerm2.num)
    );

    return { num: newNumeratorTerm, den: LCMTerm };
}

/**
 * 수식에서 동류항을 계산하는 함수
 * @param expr 동류항을 계산할 수식
 * @returns 동류항이 계산된 수식
 */
export function addSimilarFractionTermsInExpression(expr: Expression): Expression {
    const newExpr: Expression = [];

    // 각 항을 순회하면서 동류항 처리
    expr.forEach((fracTerm) => {
        let isAdded = false;

        // 이미 추가된 항들과 비교하여 동류항 처리
        for (let j = 0; j < newExpr.length; j++) {
            if (areSimilarFractionTerms(fracTerm, newExpr[j])) {
                newExpr[j] = addSimilarFractionTerms(fracTerm, newExpr[j]);
                isAdded = true;
                break;
            }
        }

        // 동류항이 없으면 그대로 추가
        if (!isAdded) newExpr.push(fracTerm);
    });

    return newExpr;
}

//-----------------------------------------------------
// 분배법칙 함수
//-----------------------------------------------------

/**
 * 항을 수식에 분배하는 함수
 * @param coefFracTerm 분배할 계수 항
 * @param expr 분배될 수식
 * @returns 분배된 결과 수식
 */
export function distributeExpressionByFractionTerm(coefFracTerm: FractionTerm, expr: Expression): Expression {
    return expr.map(term => multiplyFractionTerms(coefFracTerm, term));
}

/**
 * 두 수식을 분배하여 곱하는 함수
 * @param expr1 첫 번째 수식
 * @param expr2 두 번째 수식
 * @returns 분배 결과 수식
 */
export function distributeExpressionByExpression(expr1: Expression, expr2: Expression): Expression {
    const result: Expression = [];

    // 각 항을 두 번째 수식에 분배
    expr1.forEach(fracTerm => {
        const distributedTerms = distributeExpressionByFractionTerm(fracTerm, expr2);
        result.push(...distributedTerms);
    });

    return result;
}


//-----------------------------------------------------
// 문자열 변환 함수
//-----------------------------------------------------

/**
 * 항을 문자열로 변환하는 함수
 * 1. 항상 + 또는 - 부호로 시작하도록 보장
 * 2. 계수가 1인 경우 문자 항 앞에 1 생략
 * 3. 지수가 1인 경우 ^1 생략
 * @param term 변환할 항
 * @param doNumericFactorCalculation 숫자 계수 계산 여부
 * @returns 문자열로 변환된 항
 */
export function stringifyTerm(term: Term, doNumericFactorCalculation = true): string {
    if (!isValidTerm(term)) throw new Error('Invalid term');
    if (isZeroTerm(term)) return '+0';

    // 숫자 부분과 문자 부분 분리
    const numericTerm = getNumericTermFromTerm(term);
    const symbolicTerm = getSymbolicTermFromTerm(term);


    // 숫자 부분 처리
    const numericPart = stringifyNumericFactors(numericTerm, isValidTerm(symbolicTerm), doNumericFactorCalculation);

    // 문자 부분 처리
    const symbolicPart = stringifySymbolicFactors(symbolicTerm);

    // 결과 결합
    let result = numericPart + symbolicPart;

    return result;
}

/**
 * 항의 숫자 부분을 문자열로 처리하는 함수
 * @param numericTerm 숫자 항
 * @param existsSymbolicFactors 문자 항이 있는지 여부
 * @param doNumericFactorCalculation 숫자 계수 계산 여부
 * @returns 문자열로 처리된 숫자 부분
 */
function stringifyNumericFactors(numericTerm: NumericTerm, existsSymbolicFactors: boolean, doNumericFactorCalculation: boolean): string {

    if (!isValidTerm(numericTerm)) {
        return existsSymbolicFactors ? '+' : '+0';
    }

    const coef = calcNumericTermInTerm(numericTerm);

    if (doNumericFactorCalculation) {
        // 숫자 계수 계산

        // 문자 항 앞에 1 생략 처리
        if (existsSymbolicFactors && Math.abs(coef) === 1) {
            return coef === -1 ? '-' : '+';
        } else {
            // 부호 명시적 추가
            return coef >= 0 ? '+' + String(coef) : String(coef);
        }
    } else {
        // 계산 없이 그대로 출력
        let result = '+';
        numericTerm.forEach((power, base) => {
            result += power !== 1 ? `(${base}^${power})` : `(${base})`;
        });
        return result;
    }
}

/**
 * 항의 문자 부분을 문자열로 처리하는 함수
 * @param symbolicTerm 문자 항
 * @returns 문자열로 처리된 문자 부분
 */
function stringifySymbolicFactors(symbolicTerm: SymbolicTerm): string {
    let result = '';

    symbolicTerm.forEach((power, base) => {
        result += power !== 1 ? `${base}^${power}` : `${base}`;
    });

    return result;
}

/**
 * 분수 항을 문자열로 변환하는 함수
 * 1. 항상 + 또는 - 부호로 시작하도록 보장
 * 2. 분자와 분모의 부호를 고려하여 분수 전체의 부호 결정
 * 3. 분모가 1인 경우 분자만 출력
 * @param fracTerm 변환할 분수항
 * @returns 문자열로 변환된 분수항
 */
export function stringifyFractionTerm(fracTerm: FractionTerm): string {
    if (!isValidFractionTerm(fracTerm)) throw new Error('Invalid fraction term');

    if (isZeroFractionTerm(fracTerm))
        return '+0';

    if (isOneFractionTerm(fracTerm))
        return '+1';

    if (isOneTerm(fracTerm.den))
        return stringifyTerm(fracTerm.num);

    // 분수 형식 구성
    const newFracTerm = clearSignOfFractionTerm(fracTerm);

    let result;
    if (newFracTerm.num.has(-1)) {
        result = '-';
    } else {
        result = '+';
    }

    if (isValidTerm(getSymbolicTermFromTerm(fracTerm.den)))
        result += `(${stringifyTerm(newFracTerm.num).slice(1)}/${stringifyTerm(newFracTerm.den).slice(1)})`;
    else {
        const numericTerm = getNumericTermFromTerm(newFracTerm.num);
        const symbolicTerm = getSymbolicTermFromTerm(newFracTerm.num);
        result += `(${stringifyTerm(numericTerm).slice(1)}/${stringifyTerm(newFracTerm.den).slice(1)})`;
        if (isValidTerm(symbolicTerm)) {
            result += stringifyTerm(symbolicTerm).slice(1);
        }
    }

    return result;
}

/**
 * 수식(분수 항의 모음)을 문자열로 변환하는 함수
 * 1. 항상 + 또는 - 부호로 시작하도록 보장
 * 2. 모든 항을 순서대로 결합
 * @param expr 변환할 수식
 * @returns 문자열로 변환된 수식
 */
export function stringifyExpression(expr: Expression): string {
    if (!isValidExpression(expr)) throw new Error('Invalid expression');

    // 모든 분수 항 결합
    let result = expr.map(fracTerm => stringifyFractionTerm(fracTerm)).join('');

    // // 결과가 부호로 시작하는지 확인
    // if (!result.startsWith('-') && !result.startsWith('+')) {
    //     result = '+' + result;
    // }

    return result;
}

//-----------------------------------------------------
// 문자열 파싱 함수
//-----------------------------------------------------

/**
 * 숫자 항 문자열을 파싱하는 함수
 * @param numericTermString 파싱할 숫자 항 문자열
 * @param sign 부호 (1 또는 -1)
 * @returns 파싱된 분수항
 */
export function parseNumericTermString(numericTermString: string, sign: number): FractionTerm {
    let numerator = new Map();
    let denominator = new Map();

    if (numericTermString.search('/') !== -1) {
        // 분수 형태인 경우
        const [num, den] = numericTermString.split('/');
        numerator = primeFactorizeFromNumber(sign * Number(num));
        denominator = primeFactorizeFromNumber(Number(den));
    } else if (numericTermString.includes('.')) {
        // 소수 형태인 경우
        numerator.set(Number(numericTermString), 1);
        denominator = getOneTerm();

        // 소수를 분수로 바꿔서 처리
        // const [intPart, fracPart] = numericTermString.split(".");
        // const scale = 10 ** fracPart.length;
        // numerator = primeFactorizeFromNumber(sign * Number(numericTermString) * scale);
        // denominator = primeFactorizeFromNumber(scale);

    } else if (numericTermString === '') {
        // +1 또는 -1 인 경우
        numerator.set(sign, 1);
        denominator = getOneTerm();
    } else {
        // 정수 형태인 경우
        numerator = primeFactorizeFromNumber(sign * Number(numericTermString));
        denominator = getOneTerm();
    }

    return { num: numerator, den: denominator };
}

/**
 * 문자 항 문자열을 파싱하는 함수
 * @param symbolicTermString 파싱할 문자 항 문자열
 * @returns 파싱된 문자 항
 */
export function parseSymbolicTermString(symbolicTermString: string): Term {
    if (symbolicTermString === '') return new Map();

    const symbolicTerm = new Map();

    console.log('Parsing symbolic term string:', symbolicTermString);

    // 문자와 지수 파싱
    (symbolicTermString.match(/[a-zA-Z](?:\^\d+)?/g) || []).forEach(symbolAndPower => {
        const parts = symbolAndPower.split('^');
        const symbol = parts[0];
        const power = parts.length > 1 ? Number(parts[1]) : 1;
        symbolicTerm.set(symbol, power);
    });

    return symbolicTerm;
}

/**
 * 분수 항 문자열을 파싱하는 함수
 * 문자열은 + 또는 - 부호로 시작해야 함
 * @param fracTermString 파싱할 분수 항 문자열
 * @returns 파싱된 분수 항
 */
export function parseFractionTermString(fracTermString: string): FractionTerm {

    // 정규표현식을 사용하여 분수 항 구분
    const pattern = /^(\+|-)\(?((?:\d+\/\d+|\d+(?:\.\d+)?|\d*))\)?((?:[a-zA-Z](?:\^\d+)?)*)$/;
    const rawFracTermArr = (fracTermString.match(pattern) || []).slice(1, 4);

    // 부호, 숫자 부분, 문자 부분 추출
    const sign = rawFracTermArr[0] === '+' ? 1 : -1;
    const numericTermString = rawFracTermArr[1];
    const symbolicTermString = rawFracTermArr[2];

    // 각 부분 파싱
    const numericTerm = parseNumericTermString(numericTermString, sign);
    const symbolicTerm = parseSymbolicTermString(symbolicTermString);

    // 분자와 분모 구성
    let numerator = new Map([...numericTerm.num, ...symbolicTerm]);
    let denominator = numericTerm.den;

    return { num: numerator, den: denominator };
}

/**
 * 수식 문자열을 파싱하는 함수
 * @param exprString 파싱할 수식 문자열
 * @returns 파싱된 수식
 */
export function parseExpressionString(exprString: string): Expression {
    if (exprString === '') return [];

    // 부호가 없으면 + 부호 추가
    if (!exprString.startsWith('-') && !exprString.startsWith('+')) {
        exprString = '+' + exprString;
    }

    // 분수 항 패턴 정의
    const fracTermPattern = /(?:\+|-)\(?(?:\d+\/\d+|\d+(?:\.\d+)?|\d*)\)?(?:[a-zA-Z](?:\^\d+)?)*/g;

    const fracTermStringArr = (exprString.match(fracTermPattern) || []);

    const a = fracTermStringArr.map(fracTermString => parseFractionTermString(fracTermString));

    // 각 분수 항 파싱
    return fracTermStringArr.map(fracTermString => parseFractionTermString(fracTermString));
}

//-----------------------------------------------------
// 배열 변환 및 비교 함수
//-----------------------------------------------------

/**
 * 두 항이 같은지 비교하는 함수
 * @param term1 첫 번째 항
 * @param term2 두 번째 항
 * @returns 두 항이 같으면 true, 다르면 false
 */
export function areSameTerms(term1: Term, term2: Term): boolean {
    const termArr1 = convertTermToArr(term1);
    const termArr2 = convertTermToArr(term2);

    // 길이가 다르면 다른 항
    if (termArr1.length !== termArr2.length)
        return false;

    // 모든 요소 비교
    for (let i = 0; i < termArr1.length; i++) {
        if (termArr1[i][0] !== termArr2[i][0]) return false; // 베이스 비교
        if (termArr1[i][1] !== termArr2[i][1]) return false; // 지수 비교
    }

    return true;
}

/**
 * 두 분수 항이 같은지 비교하는 함수
 * @param fracTerm1 첫 번째 분수 항
 * @param fracTerm2 두 번째 분수 항
 * @returns 두 분수 항이 같으면 true, 다르면 false
 */
export function areSameFractionTerms(fracTerm1: FractionTerm, fracTerm2: FractionTerm): boolean {
    return areSameTerms(convertFractionTermToTerm(fracTerm1), convertFractionTermToTerm(fracTerm2));
}

/**
 * 항을 배열로 변환하는 함수
 * @param term 변환할 항
 * @returns 배열로 변환된 항
 */
export function convertTermToArr(term: Term): TermArr {
    return Array.from(term).toSorted();
}

/**
 * 분수 항을 배열로 변환하는 함수
 * @param fracTerm 변환할 분수 항
 * @returns 배열로 변환된 분수 항
 */
export function convertFractionTermToArr(fracTerm: FractionTerm): FractionTermArr {
    return [convertTermToArr(fracTerm.num), convertTermToArr(fracTerm.den)];
}

/**
 * 수식을 배열로 변환하는 함수
 * @param expr 변환할 수식
 * @returns 배열로 변환된 수식
 */
export function convertExpressionToArr(expr: Expression): ExpressionArr {
    return expr.map(fracTerm => convertFractionTermToArr(fracTerm)).toSorted();
}

/**
 * 두 수식 문자열이 동일한 수학적 수식을 나타내는지 비교하는 함수
 * 1. 수식 문자열을 파싱하여 수식 객체로 변환
 * 2. 항의 순서에 관계없이 동일한 수식인지 확인
 * 3. 분자와 분모의 모든 항을 정확히 비교
 */
export function areSameExpressionStrings(exprString1: string, exprString2: string): boolean {
    // 문자열을 수식 객체로 파싱
    const expr1 = parseExpressionString(exprString1);
    const expr2 = parseExpressionString(exprString2);

    // 비교를 위해 배열로 변환하고 정렬
    const exprArr1 = convertExpressionToArr(expr1);
    const exprArr2 = convertExpressionToArr(expr2);

    // 항의 개수가 다르면 다른 수식
    if (exprArr1.length != exprArr2.length) return false;

    // 모든 항을 순회하며 비교
    for (let i = 0; i < exprArr1.length; i++) {
        // 분자(j=0)와 분모(j=1) 각각 비교
        for (let j = 0; j < 2; j++) {
            const termArr1 = exprArr1[i][j];
            const termArr2 = exprArr2[i][j];

            // 인수 개수가 다르면 다른 항
            if (termArr1.length !== termArr2.length)
                return false;

            // 모든 인수와 지수 비교
            for (let k = 0; k < termArr1.length; k++) {
                // 인수(base) 비교
                if (termArr1[k][0] !== termArr2[k][0]) return false;
                // 지수(power) 비교
                if (termArr1[k][1] !== termArr2[k][1]) return false;
            }
        }
    }

    // 모든 비교가 통과하면 동일한 수식
    return true;
}

// return random number in the close interval [min, max] 
export function getRandomInt(min: number, max: number, allowZero = true): number {
    if (min > max) throw new Error('min cannot be greater than max');
    if (!allowZero) {
        if (min === 0 && max === 0) throw new Error('min and max cannot both be 0 when allowZero is false')
        if (max * min > 0) {
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
        } else {
            const random = Math.floor(Math.random() * (max - min)) + min;
            return random === 0 ? (max !== 0 ? max : min) : random;
        }
    } else {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export function getRandomFloat(min: number, max: number, precision = 2, allowZero = true): number {
    if (min > max) throw new Error('min cannot be greater than max');
    if (!allowZero) {
        if (min === 0 && max === 0) throw new Error('min and max cannot both be 0 when allowZero is false')
        let random;
        do {
            random = Math.random() * (max - min) + min;
        } while (random === 0);

        return parseFloat(random.toFixed(precision));
    } else {
        const random = Math.random() * (max - min) + min;
        return parseFloat(random.toFixed(precision));
    }
}

const symbolArr = ['', 'x', 'y', 'z', 'a'];

export function getRandomSymbol(min: number, max: number): string {
    if (min > max) throw new Error('min cannot be greater than max');
    if (max >= symbolArr.length) throw new Error('max exceeds available symbols');
    return symbolArr[getRandomInt(min, max)];
}

/**
 * GenerationConfig type
 * 
 * This type defines the configuration options for generating random terms, fraction terms, and expressions.
 * 
 * @typedef {Object} GenerationConfig
 * @property {number} [numIntMin=-9] - The minimum value for the numeric coefficient.
 * @property {number} [numIntMax=9] - The maximum value for the numeric coefficient.
 * @property {number} [denIntMin=-9] - The minimum value for the denominator.
 * @property {number} [denIntMax=9] - The maximum value for the denominator.
 * @property {number} [symbolMin=0] - The minimum index for the symbol array.
 * @property {number} [symbolMax=1] - The maximum index for the symbol array.
 * @property {number} [symbolPowerMin=1] - The minimum power for the symbol.
 * @property {number} [symbolPowerMax=1] - The maximum power for the symbol.
 * @property {number} [symbolCnt=1] - The number of symbols to use.
 * @property {number} [termCnt=1] - The number of terms to generate.
 * @property {boolean} [allowNumericFraction=true] - Whether to allow numeric fractions in the generated terms.
 * @param {boolean} [allowFloat=false] - Whether to allow floating-point numbers in the generated terms.
 * @param {number} [precision=1] - The precision for floating-point numbers.
 */
export type GenerationConfig = {
    /**
     * The minimum value for the numeric coefficient.
     * @default -9
     */
    numIntMin?: number;
    /**
     * The maximum value for the numeric coefficient.
     * @default 9
     */
    numIntMax?: number;
    /**
     * The minimum value for the denominator.
     * @default -9
     */
    denIntMin?: number;
    /**
     * The maximum value for the denominator.
     * @default 9
     */
    denIntMax?: number;
    /**
     * The minimum index for the symbol array.
     * @default 0
     */
    symbolMin?: number;
    /**
     * The maximum index for the symbol array.
     * @default 1
     */
    symbolMax?: number;
    /**
     * The minimum power for the symbol.
     * @default 1
     */
    symbolPowerMin?: number;
    /**
     * The maximum power for the symbol.
     * @default 1
     */
    symbolPowerMax?: number;
    /**
     * The number of symbols in a term.
     * @default 1
     */
    symbolCnt?: number;
    /**
     * The number of terms to generate.
     * @default 1
     */
    termCnt?: number;
    /**
     * Whether to allow numeric fractions.
     * @default true
     */
    allowNumericFraction?: boolean;
    /**
     * Whether to allow floating-point numbers in the generated terms.
     * If true, the numeric coefficients can be floating-point numbers.
     * @default false
     */
    allowFloat?: boolean;
    /**
     * The precision for floating-point numbers.
     * This is used when allowFloat is true.
     * @default 1
     */
    precision?: number;
}

/**
 * Generate a random term based on the given configuration.
 * @param config The configuration object for generating the term
 * @returns A random term
 */
export function getRandomTerm(config: GenerationConfig): Term {
    // if (config.symbolCnt === 0) return primeFactorizeFromNumber(getRandomInt(config.numIntMin || -9, config.numIntMax || 9, false));

    let term: Term;

    if (config.allowFloat) {
        term = new Map();
        const numericFactor = getRandomFloat(config.numIntMin ?? -9, config.numIntMax ?? 9, config.precision ?? 1, true);
        term.set(numericFactor, 1);
    } else {
        term= primeFactorizeFromNumber(getRandomInt(config.numIntMin ?? -9, config.numIntMax ?? 9, false));
    }

    for (let i = 0; i < (config.symbolCnt ?? 1); i++) {
        console.log(i)
        const symbol = getRandomSymbol(config.symbolMin ?? 0, Math.min(config.symbolMax ?? 1, symbolArr.length - 1));
        if (symbol === '') continue;
        const power = getRandomInt(config.symbolPowerMin ?? 1, config.symbolPowerMax ?? 1);
        term.set(symbol, (term.get(symbol) ?? 0) + power);
    }
    return term;
}

// Assumption: Symbolic factors are only in the numerator
export function getRandomFractionTerm(config: GenerationConfig): FractionTerm {
    const numerator: Term = getRandomTerm(config);
    const denominator: Term = primeFactorizeFromNumber(getRandomInt(config.denIntMin ?? -9, config.denIntMax ?? 9, false));
    return { num: numerator, den: denominator };
}

export function getRandomExpression(config: GenerationConfig): Expression {
    const expr: Expression = [];
    if (config.allowNumericFraction ?? config.allowNumericFraction === undefined)
        // default is true
        for (let i = 0; i < (config.termCnt ?? 1); i++)
            expr.push(getRandomFractionTerm(config));
    else if (config.allowFloat) {
        for (let i = 0; i < (config.termCnt ?? 1); i++) {
            const numerator = getRandomTerm(config);
            const denominator = getOneTerm();
            expr.push({ num: numerator, den: denominator });
        }
    }
    else
        for (let i = 0; i < (config.termCnt ?? 1); i++) {
            const randomTerm = getRandomTerm(config);
            expr.push(convertTermToFractionTerm(randomTerm));
        }
    return expr;
}