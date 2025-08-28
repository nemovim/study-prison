import {
    primeFactorizeFromNumber,
    multiplyTerms,
    divideTerms,
    areSimilarTerms,
    addSimilarTerms,
    getGCDTerm,
    getLCMTerm,
    getZeroTerm,
    getOneTerm,
    isZeroTerm,
    isOneTerm,
    getNumericTermFromTerm,
    getSymbolicTermFromTerm,
    areSameTerms,
    areSameFractionTerms,
    calcNumericTermInTerm,
    type Term,
    type NumericTerm,
    type FractionTerm,
    clearTerm
} from '../utils';

import { describe, it, expect } from 'vitest';

/**
 * 항 관련 함수들의 테스트
 * 항의 생성, 연산, 변환, 비교 등의 기능을 검증
 */
describe('항 테스트', () => {
    /**
     * 소인수분해 함수 테스트
     * 숫자를 소인수로 분해하는 기능 검증
     */
    describe('소인수분해 테스트', () => {
        it('특수 경우를 올바르게 처리해야 함', () => {
            // 0은 0^1로 분해
            expect(primeFactorizeFromNumber(0)).toEqual(new Map([[0, 1]]));
            // 1은 1^1로 분해
            expect(primeFactorizeFromNumber(1)).toEqual(new Map([[1, 1]]));
            
            // 음수 테스트 (-10 = -1 * 2 * 5)
            const negativeFactors = primeFactorizeFromNumber(-10);
            expect(negativeFactors.get(-1)).toBe(1); // -1 인자 포함
            expect(negativeFactors.get(2)).toBe(1);  // 2 인자 포함
            expect(negativeFactors.get(5)).toBe(1);  // 5 인자 포함
            expect(negativeFactors.size).toBe(3);    // 정확히 3개의 인자
            
            // 큰 음수 테스트 (-100 = -1 * 2^2 * 5^2)
            const largeNegativeFactors = primeFactorizeFromNumber(-100);
            expect(largeNegativeFactors.get(-1)).toBe(1);
            expect(largeNegativeFactors.get(2)).toBe(2);
            expect(largeNegativeFactors.get(5)).toBe(2);
            expect(largeNegativeFactors.size).toBe(3);
        });

        it('소수를 올바르게 분해해야 함', () => {
            // 2 = 2^1
            const prime2 = primeFactorizeFromNumber(2);
            expect(prime2.get(2)).toBe(1);
            expect(prime2.size).toBe(1);

            // 3 = 3^1
            const prime3 = primeFactorizeFromNumber(3);
            expect(prime3.get(3)).toBe(1);
            expect(prime3.size).toBe(1);

            // 5 = 5^1
            const prime5 = primeFactorizeFromNumber(5);
            expect(prime5.get(5)).toBe(1);
            expect(prime5.size).toBe(1);
            
            // 97 = 97^1 (큰 소수)
            const largePrime = primeFactorizeFromNumber(97);
            expect(largePrime.get(97)).toBe(1);
            expect(largePrime.size).toBe(1);
        });

        it('합성수를 올바르게 분해해야 함', () => {
            // 4 = 2^2
            const factors4 = primeFactorizeFromNumber(4);
            expect(factors4.get(2)).toBe(2);
            expect(factors4.size).toBe(1);

            // 6 = 2 * 3
            const factors6 = primeFactorizeFromNumber(6);
            expect(factors6.get(2)).toBe(1);
            expect(factors6.get(3)).toBe(1);
            expect(factors6.size).toBe(2);

            // 12 = 2^2 * 3
            const factors12 = primeFactorizeFromNumber(12);
            expect(factors12.get(2)).toBe(2);
            expect(factors12.get(3)).toBe(1);
            expect(factors12.size).toBe(2);

            // 60 = 2^2 * 3 * 5
            const factors60 = primeFactorizeFromNumber(60);
            expect(factors60.get(2)).toBe(2);
            expect(factors60.get(3)).toBe(1);
            expect(factors60.get(5)).toBe(1);
            expect(factors60.size).toBe(3);
            
            // 1000 = 2^3 * 5^3 (큰 합성수)
            const largeComposite = primeFactorizeFromNumber(1000);
            expect(largeComposite.get(2)).toBe(3);
            expect(largeComposite.get(5)).toBe(3);
            expect(largeComposite.size).toBe(2);
        });
        
        it('소인수분해 결과를 사용하여 숫자를 계산할 수 있어야 함', () => {
            // 12 = 2^2 * 3
            const factors12 = primeFactorizeFromNumber(12);
            expect(calcNumericTermInTerm(factors12)).toBe(12);
            
            // -30 = -1 * 2 * 3 * 5
            const factorsNeg30 = primeFactorizeFromNumber(-30);
            expect(calcNumericTermInTerm(factorsNeg30)).toBe(-30);
            
            // 100 = 2^2 * 5^2
            const factors100 = primeFactorizeFromNumber(100);
            expect(calcNumericTermInTerm(factors100)).toBe(100);
            const factors1001 = primeFactorizeFromNumber(1001);
            expect(factors1001.get(7)).toBe(1);
            expect(factors1001.get(11)).toBe(1);
            expect(factors1001.get(13)).toBe(1);

            // 큰 소수
            const factors1000000007 = primeFactorizeFromNumber(1000000007);
            expect(factors1000000007.get(1000000007)).toBe(1);

            // 여러 소인수를 가진 큰 수
            const factors123456789 = primeFactorizeFromNumber(123456789);
            expect(factors123456789.get(3)).toBe(2);
            expect(factors123456789.get(3607)).toBe(1);
            expect(factors123456789.get(3803)).toBe(1);
        });
    });

    /**
     * 항 상태 검사 함수 테스트
     * 항이 0인지 1인지 검사하는 함수들의 동작 검증
     */
    describe('항 상태 검사 테스트', () => {
        it('isZeroTerm은 0 항을 올바르게 감지해야 함', () => {
            // 기본 0항 (0^1)
            const term1 = new Map<number | string, number>([[0, 1]]);
            expect(isZeroTerm(term1)).toBe(true);
            
            // 0의 제곱이 다른 경우 (0^2)
            const term2 = new Map<number | string, number>([[0, 2]]);
            expect(isZeroTerm(term2)).toBe(true);
            
            // 1항은 0이 아님
            const term3 = new Map<number | string, number>([[1, 1]]);
            expect(isZeroTerm(term3)).toBe(false);
            
            // 0이 포함된 복합항 (0 * 다른 항 = 0)
            const term4 = new Map<number | string, number>([[0, 1], [2, 1]]);
            expect(isZeroTerm(term4)).toBe(true);
            
            // 문자항만 있는 경우 (0이 없음)
            const term5 = new Map<number | string, number>([['x', 2]]);
            expect(isZeroTerm(term5)).toBe(false);
            
            // getZeroTerm 함수로 생성한 항
            const zeroTerm = getZeroTerm();
            expect(isZeroTerm(zeroTerm)).toBe(true);
            
            // 빈 항은 0이 아님 (정의상)
            const emptyTerm = new Map<number | string, number>();
            expect(isZeroTerm(emptyTerm)).toBe(false);
        });

        it('isOneTerm은 1 항을 올바르게 감지해야 함', () => {
            // 기본 1항 (1^1)
            const term1 = new Map<number | string, number>([[1, 1]]);
            expect(isOneTerm(term1)).toBe(true);
            
            // 문자의 0제곱은 1 (x^0 = 1)
            const term2 = new Map<number | string, number>([['x', 0]]);
            expect(isOneTerm(term2)).toBe(true);
            
            // 다른 숫자항은 1이 아님
            const term3 = new Map<number | string, number>([[2, 1]]);
            expect(isOneTerm(term3)).toBe(false);
            
            // 1과 x^0 조합 (1 * 1 = 1)
            const term4 = new Map<number | string, number>([[1, 1], ['x', 0]]);
            expect(isOneTerm(term4)).toBe(true);
            
            // 1과 x^1 조합 (1 * x = x, 1이 아님)
            const term5 = new Map<number | string, number>([[1, 1], ['x', 1]]);
            expect(isOneTerm(term5)).toBe(false);
            
            // getOneTerm 함수로 생성한 항
            const oneTerm = getOneTerm();
            expect(isOneTerm(oneTerm)).toBe(true);
            
            // 1의 제곱이 다른 경우 (1^2)
            const onePoweredTerm = new Map<number | string, number>([[1, 2]]);
            expect(isOneTerm(onePoweredTerm)).toBe(false);
        });
    });

    /**
     * 항 변환 함수 테스트
     * 항에서 숫자 부분과 문자 부분을 추출하는 함수들의 동작 검증
     */
    describe('항 변환 테스트', () => {
        it('getNumericTermFromTerm은 숫자 인수만 올바르게 추출해야 함', () => {
            // 숫자와 문자가 혼합된 항
            const term = new Map<number | string, number>([[2, 3], ['x', 2], [3, 2]]);
            const result = getNumericTermFromTerm(term);
            
            // 숫자 인수만 추출되어야 함
            expect(result.get(2)).toBe(3);  // 2^3
            expect(result.get(3)).toBe(2);  // 3^2
            // 문자 인수는 포함되지 않음
            // 타입 안전성을 위해 Map.prototype.has 메서드의 파라미터 타입을 맞춰야 함
            const hasX = result.has('x' as unknown as number);
            expect(hasX).toBe(false);
            expect(result.size).toBe(2);    // 정확히 2개의 숫자 인수
            
            // 숫자만 있는 항
            const numericTerm = new Map<number | string, number>([[2, 1], [3, 1], [5, 1]]);
            const numericResult = getNumericTermFromTerm(numericTerm);
            expect(numericResult.size).toBe(3);
            expect(numericResult).toEqual(numericTerm);
            
            // 문자만 있는 항
            const symbolicTerm = new Map<number | string, number>([['x', 2], ['y', 1]]);
            const emptyResult = getNumericTermFromTerm(symbolicTerm);
            expect(emptyResult.size).toBe(0); // 빈 Map 반환
        });

        it('getSymbolicTermFromTerm은 문자 인수만 올바르게 추출해야 함', () => {
            // 숫자와 문자가 혼합된 항
            const term = new Map<number | string, number>([[2, 3], ['x', 2], ['y', 1]]);
            const result = getSymbolicTermFromTerm(term);
            
            // 문자 인수만 추출되어야 함
            expect(result.get('x')).toBe(2); // x^2
            expect(result.get('y')).toBe(1); // y^1
            // 숫자 인수는 포함되지 않음
            // 타입 안전성을 위해 Map.prototype.has 메서드의 파라미터 타입을 맞춰야 함
            const hasTwo = result.has(2 as unknown as string);
            expect(hasTwo).toBe(false);
            expect(result.size).toBe(2);    // 정확히 2개의 문자 인수
            
            // 문자만 있는 항
            const symbolicTerm = new Map<number | string, number>([['x', 2], ['y', 1], ['z', 3]]);
            const symbolicResult = getSymbolicTermFromTerm(symbolicTerm);
            expect(symbolicResult.size).toBe(3);
            expect(symbolicResult).toEqual(symbolicTerm);
            
            // 숫자만 있는 항
            const numericOnlyTerm = new Map<number | string, number>([[2, 1], [3, 1]]);
            const emptyResult = getSymbolicTermFromTerm(numericOnlyTerm);
            expect(emptyResult.size).toBe(0); // 빈 Map 반환
        });
        
        /**
         * clearTerm 함수 테스트
         * 항을 정규화하는 함수의 동작 검증
         */
        it('clearTerm은 0 지수를 가진 인수를 제거해야 함', () => {
            // 0 지수를 가진 인수가 있는 항 (x^0 = 1이므로 제거됨)
            const term = new Map<number | string, number>([[2, 3], ['x', 0], [3, 2]]);
            const result = clearTerm(term);
            
            // 0 지수 인수는 제거되어야 함
            expect(result.has('x')).toBe(false);
            expect(result.get(2)).toBe(3);
            expect(result.get(3)).toBe(2);
            expect(result.get(1)).toBe(1); // 계수 1 추가됨
            
            // 여러 0 지수 인수가 있는 경우
            const multiZeroPowerTerm = new Map<number | string, number>([[2, 3], ['x', 0], ['y', 0], [3, 2]]);
            const multiResult = clearTerm(multiZeroPowerTerm);
            expect(multiResult.has('x')).toBe(false);
            expect(multiResult.has('y')).toBe(false);
            expect(multiResult.size).toBe(3); // 2, 3, 1(계수) 만 남음
        });

        it('clearTerm은 음수 인수를 올바르게 처리해야 함', () => {
            // 음수 인수가 있는 항 (-2^3 * x^2)
            const term = new Map<number | string, number>([[-2, 3], ['x', 2]]);
            const result = clearTerm(term);
            
            // 음수 인수는 양수로 변환되고 -1 인수가 추가됨
            expect(result.has(-1)).toBe(true); // -1 계수 추가
            expect(result.get(2)).toBe(3);     // -2 -> 2
            expect(result.get('x')).toBe(2);   // x^2 유지
            
            // 여러 음수 인수가 있는 경우
            const multiNegativeTerm = new Map<number | string, number>([[-2, 3], [-3, 2], ['x', 2]]);
            const multiResult = clearTerm(multiNegativeTerm);
            expect(multiResult.has(-1)).toBe(true); // -1 계수 추가
            expect(multiResult.get(2)).toBe(3);     // -2 -> 2
            expect(multiResult.get(3)).toBe(2);     // -3 -> 3
            expect(multiResult.get('x')).toBe(2);   // x^2 유지
        });
        
        it('clearTerm은 1 계수를 올바르게 처리해야 함', () => {
            // 1 계수가 없는 항
            const termWithoutOne = new Map<number | string, number>([[2, 3], ['x', 2]]);
            const resultWithoutOne = clearTerm(termWithoutOne);
            expect(resultWithoutOne.get(1)).toBe(1); // 1 계수 추가됨
            
            // 1 계수가 이미 있는 항
            const termWithOne = new Map<number | string, number>([[1, 2], [2, 3], ['x', 2]]);
            const resultWithOne = clearTerm(termWithOne);
            expect(resultWithOne.get(1)).toBe(2); // 기존 1^2 유지
        });
        
        it('clearTerm은 0항을 0항으로 유지해야 함', () => {
            // 0항
            const zeroTerm = getZeroTerm();
            const result = clearTerm(zeroTerm);
            expect(isZeroTerm(result)).toBe(true);
        });
    });

    /**
     * 항 연산 함수 테스트
     * 항 사이의 수학적 연산을 수행하는 함수들의 동작 검증
     */
    describe('항 연산 테스트', () => {
        /**
         * 최대공약수(GCD) 테스트
         */
        it('getGCDTerm은 두 항의 최대공약수를 올바르게 계산해야 함', () => {
            // 숫자와 문자 인수가 모두 있는 항들
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);
            const term2 = new Map<number | string, number>([[2, 2], ['x', 2], ['y', 1]]);
            const result = getGCDTerm(term1, term2);
            
            // 공통 인수의 최소 지수가 선택되어야 함
            expect(result.get(2)).toBe(2);     // min(3, 2) = 2
            expect(result.get('x')).toBe(2);   // min(2, 2) = 2
            expect(result.has('y')).toBe(false); // term1에 없는 인수

            // 지수가 다른 경우
            const term3 = new Map<number | string, number>([[2, 4], ['x', 1]]);
            const term4 = new Map<number | string, number>([[2, 2], ['x', 3]]);
            const result2 = getGCDTerm(term3, term4);
            expect(result2.get(2)).toBe(2);     // min(4, 2) = 2
            expect(result2.get('x')).toBe(1);   // min(1, 3) = 1

            // 문자 인수만 있는 항들
            const term5 = new Map<number | string, number>([['x', 3], ['y', 2]]);
            const term6 = new Map<number | string, number>([['x', 2], ['z', 3]]);
            const result3 = getGCDTerm(term5, term6);
            expect(result3.get('x')).toBe(2);   // min(3, 2) = 2
            expect(result3.has('y')).toBe(false); // term6에 없는 인수
            expect(result3.has('z')).toBe(false); // term5에 없는 인수
        });

        /**
         * 최소공배수(LCM) 테스트
         */
        it('getLCMTerm은 두 항의 최소공배수를 올바르게 계산해야 함', () => {
            // 숫자와 문자 인수가 모두 있는 항들
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);
            const term2 = new Map<number | string, number>([[2, 2], ['x', 2], ['y', 1]]);
            const result = getLCMTerm(term1, term2);
            
            // 공통 인수의 최대 지수가 선택되고, 모든 인수가 포함되어야 함
            expect(result.get(2)).toBe(3);     // max(3, 2) = 3
            expect(result.get('x')).toBe(2);   // max(2, 2) = 2
            expect(result.get('y')).toBe(1);   // term2에만 있는 인수도 포함

            // 지수가 다른 경우
            const term3 = new Map<number | string, number>([[2, 4], ['x', 1]]);
            const term4 = new Map<number | string, number>([[2, 2], ['x', 3]]);
            const result2 = getLCMTerm(term3, term4);
            expect(result2.get(2)).toBe(4);     // max(4, 2) = 4
            expect(result2.get('x')).toBe(3);   // max(1, 3) = 3

            // 문자 인수만 있는 항들
            const term5 = new Map<number | string, number>([['x', 3], ['y', 2]]);
            const term6 = new Map<number | string, number>([['x', 2], ['z', 3]]);
            const result3 = getLCMTerm(term5, term6);
            expect(result3.get('x')).toBe(3);   // max(3, 2) = 3
            expect(result3.get('y')).toBe(2);   // term5에만 있는 인수
            expect(result3.get('z')).toBe(3);   // term6에만 있는 인수
        });

        /**
         * GCD와 LCM 특수 케이스 테스트
         */
        it('getGCDTerm과 getLCMTerm은 특수 케이스를 올바르게 처리해야 함', () => {
            // 공통 인수가 없는 경우
            const term1 = new Map<number | string, number>([[2, 3]]);
            const term2 = new Map<number | string, number>([['x', 2]]);
            
            // GCD: 공통 인수가 없으면 0 항 반환
            const gcdResult = getGCDTerm(term1, term2);
            expect(gcdResult).toEqual(getZeroTerm());

            // LCM: 모든 인수를 포함
            const lcmResult = getLCMTerm(term1, term2);
            expect(lcmResult.get(2)).toBe(3);
            expect(lcmResult.get('x')).toBe(2);
            expect(lcmResult.size).toBe(2);
        });

        /**
         * 숫자 인수 처리 테스트
         */
        it('getGCDTerm과 getLCMTerm은 숫자 인수를 올바르게 처리해야 함', () => {
            // 숫자 인수만 있는 항들
            const term1 = new Map<number | string, number>([[2, 3], [3, 2]]);
            const term2 = new Map<number | string, number>([[2, 2], [3, 3]]);
            
            // GCD: 공통 인수의 최소 지수
            const gcdResult = getGCDTerm(term1, term2);
            expect(gcdResult.get(2)).toBe(2);   // min(3, 2) = 2
            expect(gcdResult.get(3)).toBe(2);   // min(2, 3) = 2
            expect(gcdResult.size).toBe(2);

            // LCM: 공통 인수의 최대 지수
            const lcmResult = getLCMTerm(term1, term2);
            expect(lcmResult.get(2)).toBe(3);   // max(3, 2) = 3
            expect(lcmResult.get(3)).toBe(3);   // max(2, 3) = 3
            expect(lcmResult.size).toBe(2);
        });

        /**
         * 문자 인수 처리 테스트
         */
        it('getGCDTerm과 getLCMTerm은 문자 인수를 올바르게 처리해야 함', () => {
            // 동일한 문자 인수를 가진 항들
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);
            const term2 = new Map<number | string, number>([[2, 2], ['x', 2]]);
            
            // GCD: 공통 인수의 최소 지수
            const gcdResult = getGCDTerm(term1, term2);
            expect(gcdResult.get(2)).toBe(2);   // min(3, 2) = 2
            expect(gcdResult.get('x')).toBe(2);  // min(2, 2) = 2
            expect(gcdResult.size).toBe(2);

            // LCM: 공통 인수의 최대 지수
            const lcmResult = getLCMTerm(term1, term2);
            expect(lcmResult.get(2)).toBe(3);   // max(3, 2) = 3
            expect(lcmResult.get('x')).toBe(2);  // max(2, 2) = 2
            expect(lcmResult.size).toBe(2);
            
            // 다른 문자 인수를 가진 항들
            const term3 = new Map<number | string, number>([['x', 2], ['y', 3]]);
            const term4 = new Map<number | string, number>([['x', 2], ['z', 1]]);
            
            // GCD: 공통 인수만 포함
            const gcdResult2 = getGCDTerm(term3, term4);
            expect(gcdResult2.get('x')).toBe(2);
            expect(gcdResult2.has('y')).toBe(false);
            expect(gcdResult2.has('z')).toBe(false);
            expect(gcdResult2.size).toBe(1);
            
            // LCM: 모든 인수 포함
            const lcmResult2 = getLCMTerm(term3, term4);
            expect(lcmResult2.get('x')).toBe(2);
            expect(lcmResult2.get('y')).toBe(3);
            expect(lcmResult2.get('z')).toBe(1);
            expect(lcmResult2.size).toBe(3);
        });

        /**
         * 항 곱셈 테스트
         */
        it('multiplyTerms는 두 항을 올바르게 곱해야 함', () => {
            // 기본 곱셈 테스트
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const term2 = new Map<number | string, number>([[2, 2], ['x', 1]]);  // 2^2 * x^1
            const result = multiplyTerms(term1, term2);
            
            // 곱셈 결과: 같은 인수의 지수는 더해짐
            expect(result.get(2)).toBe(5);     // 3 + 2 = 5
            expect(result.get('x')).toBe(3);   // 2 + 1 = 3
            expect(result.size).toBe(2);      // 인수 개수 확인
            
            // 0 항 곱하기 (어떤 항과 곱해도 0)
            const zeroTerm = getZeroTerm();  // 0
            const anyTerm = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const zeroResult = multiplyTerms(zeroTerm, anyTerm);
            expect(isZeroTerm(zeroResult)).toBe(true);  // 0 * 아무것 = 0
            
            // 1 항 곱하기 (어떤 항과 곱해도 그 항 그대로)
            const oneTerm = getOneTerm();  // 1
            const oneResult = multiplyTerms(oneTerm, anyTerm);
            expect(oneResult.get(2)).toBe(3);   // 1 * 2^3 = 2^3
            expect(oneResult.get('x')).toBe(2); // 1 * x^2 = x^2
            expect(oneResult.size).toBe(2);    // 인수 개수 확인
            
            // 음수 지수 곱하기 (지수는 더해짐)
            const negPowerTerm1 = new Map<number | string, number>([[2, -3], ['x', 2]]);  // 2^(-3) * x^2
            const negPowerTerm2 = new Map<number | string, number>([[2, 2], ['x', -1]]);  // 2^2 * x^(-1)
            const negPowerResult = multiplyTerms(negPowerTerm1, negPowerTerm2);
            expect(negPowerResult.get(2)).toBe(-1);  // -3 + 2 = -1
            expect(negPowerResult.get('x')).toBe(1);  // 2 + (-1) = 1
            expect(negPowerResult.size).toBe(2);     // 인수 개수 확인
            
            // 서로 다른 인수를 가진 항 곱하기
            const term3 = new Map<number | string, number>([[2, 1], ['y', 2]]);  // 2^1 * y^2
            const term4 = new Map<number | string, number>([[3, 1], ['z', 3]]);  // 3^1 * z^3
            const mixedResult = multiplyTerms(term3, term4);
            expect(mixedResult.get(2)).toBe(1);   // 2^1
            expect(mixedResult.get(3)).toBe(1);   // 3^1
            expect(mixedResult.get('y')).toBe(2); // y^2
            expect(mixedResult.get('z')).toBe(3); // z^3
            expect(mixedResult.size).toBe(4);    // 인수 개수 확인
        });

        /**
         * 항 나눗셈 테스트
         */
        it('divideTerms는 두 항을 올바르게 나누어야 함', () => {
            // 기본 나눗셈 테스트
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const term2 = new Map<number | string, number>([[2, 2], ['x', 1]]);  // 2^2 * x^1
            const result = divideTerms(term1, term2);
            
            // 나눗셈 결과: 같은 인수의 지수는 빼짐
            expect(result.get(2)).toBe(1);     // 3 - 2 = 1
            expect(result.get('x')).toBe(1);   // 2 - 1 = 1
            expect(result.size).toBe(2);      // 인수 개수 확인
            
            // 같은 항 나누기 (결과 1)
            const sameTerm1 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const sameTerm2 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const sameResult = clearTerm(divideTerms(sameTerm1, sameTerm2));
            expect(isOneTerm(sameResult)).toBe(true);  // 같은 항을 나누면 1
            expect(sameResult.get(1)).toBe(1);        // 1^1 = 1
            expect(sameResult.get(2)).toBeUndefined(); // 2 인수 없음
            expect(sameResult.get('x')).toBeUndefined(); // x 인수 없음
            
            // 분모에 없는 인수 (지수가 음수가 됨)
            const term3 = new Map<number | string, number>([[2, 3]]);      // 2^3
            const term4 = new Map<number | string, number>([['x', 2]]);   // x^2
            const result2 = divideTerms(term3, term4);
            expect(result2.get(2)).toBe(3);     // 2^3 그대로
            expect(result2.get('x')).toBe(-2);  // x^(-2) (분모에 있으면 음수 지수)
            expect(result2.size).toBe(2);      // 인수 개수 확인
            
            // 분자에 없는 인수 (지수가 음수가 됨)
            const result3 = divideTerms(term4, term3);
            expect(result3.get(2)).toBe(-3);    // 2^(-3) (분자에 없으면 음수 지수)
            expect(result3.get('x')).toBe(2);   // x^2 그대로
            expect(result3.size).toBe(2);      // 인수 개수 확인
            
            // 0 항 나누기 예외 테스트
            const zeroTerm = getZeroTerm();  // 0
            const nonZeroTerm = getOneTerm(); // 1
            expect(() => divideTerms(nonZeroTerm, zeroTerm)).toThrow(); // 0으로 나누기 예외 발생
            
            // 0 / 아무것 = 0
            const zeroDivideResult = divideTerms(zeroTerm, nonZeroTerm);
            expect(isZeroTerm(zeroDivideResult)).toBe(true);
        });

        /**
         * 항 유사성 검사 테스트
         */
        it('areSimilarTerms는 유사한 항을 올바르게 감지해야 함', () => {
            // 기본 유사한 항 테스트
            const term1 = new Map<number | string, number>([['x', 2], ['y', 1]]);  // x^2 * y^1
            const term2 = new Map<number | string, number>([['x', 2], ['y', 1]]);  // x^2 * y^1
            expect(areSimilarTerms(term1, term2)).toBe(true);  // 동일한 문자 인수, 동일한 지수
            
            // 지수가 다른 경우
            const term3 = new Map<number | string, number>([['x', 2], ['y', 2]]);  // x^2 * y^2
            expect(areSimilarTerms(term1, term3)).toBe(false); // y의 지수가 다름
            
            // 인수 순서가 다른 경우 (순서는 중요하지 않음)
            const term4 = new Map<number | string, number>([['y', 1], ['x', 2]]);  // y^1 * x^2
            expect(areSimilarTerms(term1, term4)).toBe(true);  // 순서만 다르고 동일한 문자 인수와 지수
            
            // 추가 인수가 있는 경우
            const term5 = new Map<number | string, number>([['x', 2], ['y', 1], ['z', 3]]);  // x^2 * y^1 * z^3
            expect(areSimilarTerms(term1, term5)).toBe(false); // term5는 z 인수가 추가로 있음
            
            // 숫자 인수가 다른 경우 (숫자 인수는 계수로 간주되어 유사성 검사에 영향 없음)
            const term6 = new Map<number | string, number>([[2, 3], ['x', 2], ['y', 1]]);  // 2^3 * x^2 * y^1
            const term7 = new Map<number | string, number>([[3, 2], ['x', 2], ['y', 1]]);  // 3^2 * x^2 * y^1
            expect(areSimilarTerms(term6, term7)).toBe(true);  // 숫자 인수는 다르지만 문자 인수와 지수는 동일
            
            // 빈 항들 (빈 항들은 서로 유사함)
            const emptyTerm1 = new Map<number | string, number>();
            const emptyTerm2 = new Map<number | string, number>();
            expect(areSimilarTerms(emptyTerm1, emptyTerm2)).toBe(true);
            
            // 한쪽은 빈 항, 다른 쪽은 숫자 인수만 있는 항
            const numericTerm = new Map<number | string, number>([[2, 1]]);  // 2^1
            expect(areSimilarTerms(emptyTerm1, numericTerm)).toBe(true); // 숫자 인수는 유사성 검사에 영향 없음
        });

        /**
         * 동류항 덧셈 테스트
         */
        it('addSimilarTerms는 동류항을 올바르게 더해야 함', () => {
            // 기본 동류항 덧셈 테스트
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const term2 = new Map<number | string, number>([[2, 2], ['x', 2]]);  // 2^2 * x^2
            const result = addSimilarTerms(term1, term2);
            
            // 덧셈 결과: 숫자 인수는 곱해지고, 문자 인수는 유지됨
            expect(result.get(2)).toBe(2);      // 2^2
            expect(result.get(3)).toBe(1);      // 3^1
            expect(result.get('x')).toBe(2);    // x^2 유지
            expect(result.size).toBe(3);       // 인수 개수 확인
            
            // 동일한 항 더하기 (계수가 2배가 됨)
            const term3 = new Map<number | string, number>([[2, 1], ['x', 2]]);  // 2^1 * x^2
            const term4 = new Map<number | string, number>([[2, 1], ['x', 2]]);  // 2^1 * x^2
            const result2 = addSimilarTerms(term3, term4);
            expect(result2.get(2)).toBe(2);     // 2^1 + 2^1 = 2^2
            expect(result2.get('x')).toBe(2);   // x^2 유지
            expect(result2.size).toBe(2);      // 인수 개수 확인
            
            // 상코되는 항 더하기 (계수가 0이 되어 상코됨)
            const term5 = new Map<number | string, number>([[2, 1], ['x', 2]]);  // 2^1 * x^2
            const term6 = new Map<number | string, number>([[2, -1], ['x', 2]]); // 2^(-1) * x^2
            const result3 = addSimilarTerms(term5, term6);
            expect(result3.has(2)).toBe(false);  // 2 인수 상코됨
            expect(result3.get('x')).toBe(2);    // x^2 유지
            expect(result3.size).toBe(1);       // 인수 개수 확인
            
            // 다른 구조의 항 더하기 (동류항이 아닌 경우 예외 발생)
            const term7 = new Map<number | string, number>([[2, 1], ['x', 2]]);  // 2^1 * x^2
            const term8 = new Map<number | string, number>([[2, 1], ['y', 2]]);  // 2^1 * y^2
            expect(() => addSimilarTerms(term7, term8)).toThrow(); // 동류항이 아님 (x vs y)
            
            // 두 항 모두 0인 경우
            const zeroTerm1 = getZeroTerm();
            const zeroTerm2 = getZeroTerm();
            const zeroResult = addSimilarTerms(zeroTerm1, zeroTerm2);
            expect(isZeroTerm(zeroResult)).toBe(true);
        });
    });

    /**
     * 항 비교 테스트
     * 두 항이 정확히 동일한지 비교하는 함수의 동작 검증
     */
    describe('항 비교 테스트', () => {
        it('areSameTerms는 두 항이 정확히 동일한지 올바르게 비교해야 함', () => {
            // 기본 동일한 항 테스트
            const term1 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            const term2 = new Map<number | string, number>([[2, 3], ['x', 2]]);  // 2^3 * x^2
            expect(areSameTerms(term1, term2)).toBe(true);  // 모든 인수와 지수가 동일
            
            // 지수가 다른 경우
            const term3 = new Map<number | string, number>([[2, 3], ['x', 1]]);  // 2^3 * x^1
            expect(areSameTerms(term1, term3)).toBe(false); // x의 지수가 다름
            
            // 인수가 다른 경우
            const term4 = new Map<number | string, number>([[2, 3], ['y', 2]]);  // 2^3 * y^2
            expect(areSameTerms(term1, term4)).toBe(false); // x vs y
            
            // 인수 개수가 다른 경우
            const term5 = new Map<number | string, number>([[2, 3], ['x', 2], ['y', 1]]);  // 2^3 * x^2 * y^1
            expect(areSameTerms(term1, term5)).toBe(false); // term5는 추가 인수 y가 있음
            
            // 순서가 다른 경우 (순서는 중요하지 않음)
            const term6 = new Map<number | string, number>([['x', 2], [2, 3]]);  // x^2 * 2^3
            expect(areSameTerms(term1, term6)).toBe(true);  // 순서만 다르고 동일한 인수와 지수
            
            // 0 항 비교
            const zeroTerm1 = getZeroTerm();
            const zeroTerm2 = getZeroTerm();
            expect(areSameTerms(zeroTerm1, zeroTerm2)).toBe(true); // 0 = 0
            
            // 1 항 비교
            const oneTerm1 = getOneTerm();
            const oneTerm2 = getOneTerm();
            expect(areSameTerms(oneTerm1, oneTerm2)).toBe(true); // 1 = 1
            
            // 0과 1 비교
            expect(areSameTerms(zeroTerm1, oneTerm1)).toBe(false); // 0 ≠ 1
        });
        
        it('areSameFractionTerms는 두 분수항이 정확히 동일한지 올바르게 비교해야 함', () => {
            // 기본 동일한 분수항 테스트
            const fracTerm1 = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), // 2^3 * x^2
                den: new Map<number | string, number>([[3, 1]])             // 3^1
            };
            const fracTerm2 = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), // 2^3 * x^2
                den: new Map<number | string, number>([[3, 1]])             // 3^1
            };
            expect(areSameFractionTerms(fracTerm1, fracTerm2)).toBe(true); // 분자, 분모 모두 동일
            
            // 분자가 다른 경우
            const fracTerm3 = { 
                num: new Map<number | string, number>([[2, 2], ['x', 2]]), // 2^2 * x^2
                den: new Map<number | string, number>([[3, 1]])             // 3^1
            };
            expect(areSameFractionTerms(fracTerm1, fracTerm3)).toBe(false); // 분자의 2 지수가 다름
            
            // 분모가 다른 경우
            const fracTerm4 = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), // 2^3 * x^2
                den: new Map<number | string, number>([[3, 2]])             // 3^2
            };
            expect(areSameFractionTerms(fracTerm1, fracTerm4)).toBe(false); // 분모의 3 지수가 다름
        });
    });
});
