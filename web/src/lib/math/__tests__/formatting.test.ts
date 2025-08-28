import {
    clearTerm,
    clearFractionTerm,
    stringifyTerm,
    stringifyFractionTerm,
    stringifyExpression,
    areSameExpressionStrings,
    areSameTerms,
    areSameFractionTerms,
    isZeroTerm,
    isOneTerm,
    getZeroTerm,
    getOneTerm,
    getZeroFractionTerm,
    getOneFractionTerm,
    parseExpressionString,
    type Term,
    type FractionTerm,
    type Expression
} from '../utils';

import { describe, it, expect } from 'vitest';

/**
 * 수학 유틸리티 함수들의 포맷팅 및 정규화 기능 테스트
 */
describe('포맷팅 및 정규화 테스트', () => {
    /**
     * clearTerm 함수 테스트
     * 항을 정규화하여 항상 1 또는 -1을 계수로 갖도록 함
     */
    describe('clearTerm 정규화 테스트', () => {
        it('항을 정규화하여 1 또는 -1을 계수로 갖도록 해야 함', () => {
            // 빈 항은 1을 계수로 가져야 함
            const emptyTerm: Term = new Map();
            const normalizedEmpty = clearTerm(emptyTerm);
            expect(normalizedEmpty.get(1)).toBe(1);
            
            // 양수 계수만 있는 항은 1을 계수로 가져야 함
            const positiveTerm: Term = new Map([[2, 3], [3, 2]]);
            const normalizedPositive = clearTerm(positiveTerm);
            expect(normalizedPositive.get(1)).toBe(1);
            expect(normalizedPositive.get(2)).toBe(3);
            expect(normalizedPositive.get(3)).toBe(2);
            
            // 음수 계수가 있는 항은 -1을 계수로 가져야 함
            const negativeTerm: Term = new Map([[-2, 3], [3, 2]]);
            const normalizedNegative = clearTerm(negativeTerm);
            expect(normalizedNegative.get(-1)).toBe(1);
            expect(normalizedNegative.get(2)).toBe(3);
            expect(normalizedNegative.get(3)).toBe(2);
            
            // 여러 음수 계수가 있는 항은 -1을 계수로 가져야 함
            const multipleNegativeTerm: Term = new Map([[-2, 3], [-3, 2]]);
            const normalizedMultipleNegative = clearTerm(multipleNegativeTerm);
            expect(normalizedMultipleNegative.get(-1)).toBe(1);
            expect(normalizedMultipleNegative.get(2)).toBe(3);
            expect(normalizedMultipleNegative.get(3)).toBe(2);
        });
        
        it('1의 기존 지수는 유지되어야 함', () => {
            // 1의 제곱항이 있는 경우
            const termWithPowersOf1: Term = new Map([[1, 2], [2, 3]]);
            const normalizedTerm = clearTerm(termWithPowersOf1);
            expect(normalizedTerm.get(1)).toBe(2); // 1^2 유지
            expect(normalizedTerm.get(2)).toBe(3);
        });
        
        it('0항은 0항으로 정규화되어야 함', () => {
            const zeroTerm: Term = getZeroTerm();
            const normalizedZero = clearTerm(zeroTerm);
            expect(isZeroTerm(normalizedZero)).toBe(true);
        });
        
        it('문자항을 포함한 항도 올바르게 정규화되어야 함', () => {
            const symbolicTerm: Term = new Map<number|string, number>([[2, 1], ['x', 2], ['y', 1]]);
            const normalizedSymbolic = clearTerm(symbolicTerm);
            expect(normalizedSymbolic.get(1)).toBe(1); // 계수 1 추가
            expect(normalizedSymbolic.get(2)).toBe(1);
            expect(normalizedSymbolic.get('x')).toBe(2);
            expect(normalizedSymbolic.get('y')).toBe(1);
            
            const negativeSymbolicTerm: Term = new Map<number|string, number>([[-2, 1], ['x', 2], ['y', 1]]);
            const normalizedNegSymbolic = clearTerm(negativeSymbolicTerm);
            expect(normalizedNegSymbolic.get(-1)).toBe(1); // 계수 -1 추가
            expect(normalizedNegSymbolic.get(2)).toBe(1);
            expect(normalizedNegSymbolic.get('x')).toBe(2);
            expect(normalizedNegSymbolic.get('y')).toBe(1);
        });
    });
    
    /**
     * stringifyTerm 함수 테스트
     * 항을 문자열로 변환하는 기능 테스트
     */
    describe('stringifyTerm 문자열 변환 테스트', () => {
        it('항상 문자열의 시작에 + 또는 - 부호가 포함되어야 함', () => {
            // 양수 항
            const positiveTerm: Term = new Map([[2, 3], [3, 2]]);
            const positiveStr = stringifyTerm(positiveTerm);
            expect(positiveStr.startsWith('+')).toBe(true);
            expect(positiveStr).toBe('+8x2^3x3^2'); // 계산된 결과 확인
            
            // 음수 항
            const negativeTerm: Term = new Map([[-1, 1], [2, 3]]);
            const negativeStr = stringifyTerm(negativeTerm);
            expect(negativeStr.startsWith('-')).toBe(true);
            expect(negativeStr).toBe('-2^3'); // 계산된 결과 확인
            
            // 0 항
            const zeroTerm: Term = getZeroTerm();
            const zeroStr = stringifyTerm(zeroTerm);
            expect(zeroStr).toBe('+0');
            
            // 문자만 있는 항
            const symbolicTerm: Term = new Map<number|string, number>([['x', 2]]);
            const symbolicStr = stringifyTerm(symbolicTerm);
            expect(symbolicStr.startsWith('+')).toBe(true);
            expect(symbolicStr).toBe('+x^2');
        });
        
        it('계수 1을 올바르게 처리해야 함', () => {
            // 계수가 1이고 문자항이 있는 경우 (1 생략)
            const termWithCoef1: Term = new Map<number|string, number>([[1, 1], ['x', 2]]);
            const strWithCoef1 = stringifyTerm(termWithCoef1);
            expect(strWithCoef1).toBe('+x^2'); // 1 생략
            
            // 계수가 -1이고 문자항이 있는 경우 (-1 생략)
            const termWithCoefNeg1: Term = new Map<number|string, number>([[-1, 1], ['x', 2]]);
            const strWithCoefNeg1 = stringifyTerm(termWithCoefNeg1);
            expect(strWithCoefNeg1).toBe('-x^2'); // -1 생략
            
            // 계수가 1이고 문자항이 없는 경우 (1 표시)
            const termWithOnly1: Term = new Map([[1, 1]]);
            const strWithOnly1 = stringifyTerm(termWithOnly1);
            expect(strWithOnly1).toBe('+1'); // 1 표시
        });
        
        it('지수 1은 생략되어야 함', () => {
            // 문자 지수가 1인 경우
            const termWithPower1: Term = new Map<number|string, number>([[2, 1], ['x', 1]]);
            const strWithPower1 = stringifyTerm(termWithPower1);
            expect(strWithPower1).toBe('+2x'); // ^1 생략
            
            // 숫자 지수가 1인 경우
            const numericTermWithPower1: Term = new Map<number|string, number>([[2, 1], [3, 1]]);
            const numStrWithPower1 = stringifyTerm(numericTermWithPower1);
            expect(numStrWithPower1).toBe('+6'); // ^1 생략, 계산된 결과
        });
        
        it('calcNumericFactors 옵션을 올바르게 처리해야 함', () => {
            // calcNumericFactors = true (기본값)
            const term: Term = new Map<number|string, number>([[2, 2], [3, 1], ['x', 2]]);
            const strWithCalc = stringifyTerm(term);
            expect(strWithCalc).toBe('+12x^2'); // 2^2 * 3^1 = 12
            
            // calcNumericFactors = false
            const strWithoutCalc = stringifyTerm(term, false);
            expect(strWithoutCalc).toBe('+2^2x3x^2'); // 계산 없이 그대로 표시
        });
    });
    
    /**
     * stringifyFractionTerm 함수 테스트
     * 분수항을 문자열로 변환하는 기능 테스트
     */
    describe('stringifyFractionTerm 분수 문자열 변환 테스트', () => {
        it('항상 문자열의 시작에 + 또는 - 부호가 포함되어야 함', () => {
            // 양수 분수
            const positiveFrac: FractionTerm = {
                num: new Map([[2, 1]]),
                den: new Map([[3, 1]])
            };
            const positiveStr = stringifyFractionTerm(positiveFrac);
            expect(positiveStr.startsWith('+')).toBe(true);
            expect(positiveStr).toBe('+(2/3)');
            
            // 음수 분수 (분자가 음수)
            const negativeFrac1: FractionTerm = {
                num: new Map([[-1, 1], [2, 1]]),
                den: new Map([[3, 1]])
            };
            const negativeStr1 = stringifyFractionTerm(negativeFrac1);
            expect(negativeStr1.startsWith('-')).toBe(true);
            expect(negativeStr1).toBe('-(2/3)');
            
            // 음수 분수 (분모가 음수)
            const negativeFrac2: FractionTerm = {
                num: new Map([[2, 1]]),
                den: new Map([[-1, 1], [3, 1]])
            };
            const negativeStr2 = stringifyFractionTerm(negativeFrac2);
            expect(negativeStr2.startsWith('-')).toBe(true);
            expect(negativeStr2).toBe('-(2/3)');
            
            // 분자와 분모가 모두 음수인 경우 (양수 결과)
            const doubleNegativeFrac: FractionTerm = {
                num: new Map([[-1, 1], [2, 1]]),
                den: new Map([[-1, 1], [3, 1]])
            };
            const doubleNegativeStr = stringifyFractionTerm(doubleNegativeFrac);
            expect(doubleNegativeStr.startsWith('+')).toBe(true);
            expect(doubleNegativeStr).toBe('+(2/3)');
            
            // 0 분수
            const zeroFrac: FractionTerm = getZeroFractionTerm();
            const zeroStr = stringifyFractionTerm(zeroFrac);
            expect(zeroStr).toBe('+0');
        });
        
        it('분모가 1인 경우 분자만 출력해야 함', () => {
            // 분모가 1인 경우 (숫자만)
            const fracWithDen1Num: FractionTerm = {
                num: new Map<number|string, number>([[2, 1]]),
                den: new Map<number|string, number>([[1, 1]])
            };
            const strWithDen1Num = stringifyFractionTerm(fracWithDen1Num);
            expect(strWithDen1Num).toBe('+2'); // 분모 생략
            
            // 분모가 1인 경우 (문자 포함)
            const fracWithDen1: FractionTerm = {
                num: new Map<number|string, number>([[2, 1], ['x', 2]]),
                den: new Map<number|string, number>([[1, 1]])
            };
            const strWithDen1 = stringifyFractionTerm(fracWithDen1);
            expect(strWithDen1).toBe('+2x^2'); // 분모 생략
        });
        
        it('문자항이 있는 분수를 올바르게 처리해야 함', () => {
            // 분자에 문자항이 있는 경우
            const fracWithSymbolicNum: FractionTerm = {
                num: new Map<number|string, number>([[2, 1], ['x', 2]]),
                den: new Map<number|string, number>([[3, 1]])
            };
            const strWithSymbolicNum = stringifyFractionTerm(fracWithSymbolicNum);
            expect(strWithSymbolicNum).toBe('+(2/3)x^2');
            
            // 분자와 분모 모두에 문자항이 있는 경우
            // 이 경우는 convertTermToFractionTerm 함수를 통해 처리됨
            // 직접 테스트하기 위해 분수항 생성
            const fracWithSymbolicBoth: FractionTerm = {
                num: new Map<number|string, number>([[2, 1], ['x', 2]]),
                den: new Map<number|string, number>([[3, 1], ['y', 1]])
            };
            const strWithSymbolicBoth = stringifyFractionTerm(fracWithSymbolicBoth);
            expect(strWithSymbolicBoth).toBe('+(2/3)x^2'); // 분모의 문자항은 별도 처리 필요
        });
    });
    
    /**
     * stringifyExpression 함수 테스트
     * 수식(분수 항의 모음)을 문자열로 변환하는 기능 테스트
     */
    describe('stringifyExpression 수식 문자열 변환 테스트', () => {
        it('항상 문자열의 시작에 + 또는 - 부호가 포함되어야 함', () => {
            // 양수 항만 있는 수식
            const positiveExpr: Expression = [
                {
                    num: new Map<number|string, number>([[2, 1]]),
                    den: new Map([[1, 1]])
                },
                {
                    num: new Map<number|string, number>([[3, 1], ['x', 1]]),
                    den: new Map([[1, 1]])
                }
            ];
            const positiveStr = stringifyExpression(positiveExpr);
            expect(positiveStr.startsWith('+')).toBe(true);
            expect(positiveStr).toBe('+2+3x'); // 계산된 결과 확인
            
            // 첫 항이 음수인 수식
            const negativeExpr: Expression = [
                {
                    num: new Map<number|string, number>([[-1, 1], [2, 1]]),
                    den: new Map([[1, 1]])
                },
                {
                    num: new Map<number|string, number>([[3, 1], ['x', 1]]),
                    den: new Map([[1, 1]])
                }
            ];
            const negativeStr = stringifyExpression(negativeExpr);
            expect(negativeStr.startsWith('-')).toBe(true);
            expect(negativeStr).toBe('-2+3x'); // 계산된 결과 확인
            
            // 빈 수식
            const emptyExpr: Expression = [];
            const emptyStr = stringifyExpression(emptyExpr);
            expect(emptyStr).toBe('+0');
        });
        
        it('분수 항을 포함한 수식을 올바르게 처리해야 함', () => {
            // 분수 항을 포함한 수식
            const fractionExpr: Expression = [
                {
                    num: new Map<number|string, number>([[2, 1]]),
                    den: new Map<number|string, number>([[3, 1]])
                },
                {
                    num: new Map<number|string, number>([[1, 1], ['x', 1]]),
                    den: new Map<number|string, number>([[2, 1]])
                }
            ];
            const fractionStr = stringifyExpression(fractionExpr);
            expect(fractionStr).toBe('+(2/3)+(1/2)x'); // 분수 형태 유지
            
            // 분자가 0인 분수 항을 포함한 수식
            const zeroNumExpr: Expression = [
                getZeroFractionTerm(),
                {
                    num: new Map<number|string, number>([[1, 1], ['x', 1]]),
                    den: new Map<number|string, number>([[2, 1]])
                }
            ];
            const zeroNumStr = stringifyExpression(zeroNumExpr);
            expect(zeroNumStr).toBe('+0+(1/2)x'); // 0 항 포함
        });
        
        it('문자열 변환과 파싱이 서로 일치해야 함', () => {
            // 문자열 -> 수식 -> 문자열 변환 테스트
            const exprString = '+2x-3y+4';
            const expr = parseExpressionString(exprString);
            const backToString = stringifyExpression(expr);
            
            // 형식이 다를 수 있으나 수학적으로 동일해야 함
            expect(areSameExpressionStrings(exprString, backToString)).toBe(true);
            
            // 분수 형태 문자열 테스트
            const fracExprString = '+(1/2)x-(3/4)y+(5/6)';
            const fracExpr = parseExpressionString(fracExprString);
            const fracBackToString = stringifyExpression(fracExpr);
            
            expect(areSameExpressionStrings(fracExprString, fracBackToString)).toBe(true);
        });
    });
    
    /**
     * 전체 파이프라인 테스트
     * 여러 함수들이 함께 작동할 때 일관성을 유지하는지 테스트
     */
    describe('전체 파이프라인 테스트', () => {
        it('전체 파이프라인에서 부호가 일관성 있게 처리되어야 함', () => {
            // 음수 계수를 포함한 항
            const term: Term = new Map<number|string, number>([[-2, 3], ['x', 2]]);
            const cleared = clearTerm(term);
            const stringified = stringifyTerm(cleared);
            
            // -1 계수와 양수 인수로 정규화되어야 함
            expect(cleared.has(-1)).toBe(true);
            expect(cleared.get(2)).toBe(3);
            expect(stringified.startsWith('-')).toBe(true);
            expect(stringified).toBe('-2^3x^2'); // 정확한 결과 확인
            
            // 분수 항에서도 일관성 유지
            const fracTerm: FractionTerm = {
                num: new Map<number|string, number>([[-2, 3], ['x', 2]]),
                den: new Map([[3, 1]])
            };
            const clearedFrac = clearFractionTerm(fracTerm);
            const stringifiedFrac = stringifyFractionTerm(clearedFrac);
            
            // 분자에 -1 계수와 양수 인수로 정규화되어야 함
            expect(clearedFrac.num.has(-1)).toBe(true);
            expect(clearedFrac.num.get(2)).toBe(3);
            expect(stringifiedFrac.startsWith('-')).toBe(true);
            expect(stringifiedFrac).toBe('-(2^3/3)x^2'); // 정확한 결과 확인
        });
        
        it('순서가 다르지만 수학적으로 동일한 수식을 비교할 수 있어야 함', () => {
            // 순서가 다른 두 수식
            const expr1 = '2x+3y';
            const expr2 = '3y+2x';
            
            // 수학적으로 동일한 수식으로 인식해야 함
            expect(areSameExpressionStrings(expr1, expr2)).toBe(true);
            
            // 부호가 다른 항을 포함한 수식
            const expr3 = '-2x+3y';
            const expr4 = '3y-2x';
            
            // 수학적으로 동일한 수식으로 인식해야 함
            expect(areSameExpressionStrings(expr3, expr4)).toBe(true);
        });
        
        it('정규화와 비교 함수들이 함께 작동해야 함', () => {
            // 정규화 후 비교 테스트
            const term1: Term = new Map<number|string, number>([[2, 1], ['x', 2]]);
            const term2: Term = new Map<number|string, number>([[2, 1], ['x', 2]]);
            
            // 두 항이 동일해야 함
            expect(areSameTerms(term1, term2)).toBe(true);
            
            // 정규화 후 동일한 결과가 나와야 함
            const cleared1 = clearTerm(term1);
            const cleared2 = clearTerm(term2);
            expect(areSameTerms(cleared1, cleared2)).toBe(true);
            
            // 분수 항 비교 테스트
            const fracTerm1: FractionTerm = {
                num: new Map<number|string, number>([[2, 1], ['x', 2]]),
                den: new Map<number|string, number>([[3, 1]])
            };
            const fracTerm2: FractionTerm = {
                num: new Map<number|string, number>([[2, 1], ['x', 2]]),
                den: new Map<number|string, number>([[3, 1]])
            };
            
            // 두 분수 항이 동일해야 함
            expect(areSameFractionTerms(fracTerm1, fracTerm2)).toBe(true);
            
            // 정규화 후 동일한 결과가 나와야 함
            const clearedFrac1 = clearFractionTerm(fracTerm1);
            const clearedFrac2 = clearFractionTerm(fracTerm2);
            expect(areSameFractionTerms(clearedFrac1, clearedFrac2)).toBe(true);
        });
    });
});
