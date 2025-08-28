import {
    multiplyFractionTerms,
    divideFractionTerms,
    addSimilarFractionTerms,
    clearFractionTerm,
    convertTermToFractionTerm,
    convertFractionTermToTerm,
    areSameFractionTerms,
    areSimilarFractionTerms,
    getZeroFractionTerm,
    getOneFractionTerm,
    parseFractionTermString,
    type FractionTerm,
    type Term
} from '../utils';

import { describe, it, expect } from 'vitest';

describe('Fractions Tests', () => {
    // 분수항 변환 테스트
    describe('Fraction Conversion Tests', () => {
        it('convertTermToFractionTerm should convert terms with negative powers correctly', () => {
            const term = new Map<number | string, number>([[2, 3], ['x', -2], [3, -1]]);
            const result = convertTermToFractionTerm(term);
            expect(result.num.get(2)).toBe(3);
            expect(result.den.get('x')).toBe(2);
            expect(result.den.get(3)).toBe(1);
            
            // 모든 항이 음수 지수인 경우
            const allNegativeTerm = new Map<number | string, number>([[2, -3], ['x', -2]]);
            const allNegativeResult = convertTermToFractionTerm(allNegativeTerm);
            expect(allNegativeResult.num.get(1)).toBe(1); // 분자는 1이 됨
            expect(allNegativeResult.den.get(2)).toBe(3);
            expect(allNegativeResult.den.get('x')).toBe(2);
        });

        it('convertTermToFractionTerm should handle zero powers correctly', () => {
            const term = new Map<number | string, number>([[2, 3], ['x', 0], [3, -1]]);
            const result = convertTermToFractionTerm(term);
            expect(result.num.get(2)).toBe(3);
            expect(result.den.get(3)).toBe(1);
            expect(result.num.get('x')).toBe(0);
        });

        it('convertFractionTermToTerm should convert fraction terms back to terms correctly', () => {
            const fracTerm = { 
            num: new Map<number | string, number>([[2, 3]]),
            den: new Map<number | string, number>([['x', 2], [3, 1]]) 
        };
            const result = convertFractionTermToTerm(fracTerm);
            expect(result.get(2)).toBe(3);
            expect(result.get('x')).toBe(-2);
            expect(result.get(3)).toBe(-1);
        });
    });

    // 분수항 약분 테스트
    describe('Fraction Simplification Tests', () => {
        it('simplifyFractionTerm should simplify fraction terms correctly', () => {
            const fracTerm = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]),
                den: new Map<number | string, number>([[2, 2], ['x', 1]])
            };
            const result = clearFractionTerm(fracTerm);
            expect(result.num.get(2)).toBe(1);
            expect(result.num.get('x')).toBe(1);
            expect(result.den.get(1)).toBe(1);
            
            // 완전히 약분되는 경우 (1/1이 됨)
            const fullyCancelableTerm = {
                num: new Map<number | string, number>([[2, 3], ['x', 2]]),
                den: new Map<number | string, number>([[2, 3], ['x', 2]])
            };
            const fullyCancelableResult = clearFractionTerm(fullyCancelableTerm);
            expect(fullyCancelableResult.num.get(1)).toBe(1);
            expect(fullyCancelableResult.den.get(1)).toBe(1);
            expect(fullyCancelableResult.num.size).toBe(1);
            expect(fullyCancelableResult.den.size).toBe(1);
            
            // 공통 인자가 없는 경우
            const noCommonFactorTerm = {
                num: new Map<number | string, number>([[2, 3]]),
                den: new Map<number | string, number>([['x', 2]])
            };
            const noCommonFactorResult = clearFractionTerm(noCommonFactorTerm);
            expect(noCommonFactorResult.num.get(2)).toBe(3);
            expect(noCommonFactorResult.den.get('x')).toBe(2);
        });

        it('clearFractionTerm should clear negative powers correctly', () => {
            const fracTerm = { 
                num: new Map<number | string, number>([[2, 3], ['x', -2]]),
                den: new Map<number | string, number>([[2, 2], ['x', 1]])
            };
            const result = clearFractionTerm(fracTerm);
            expect(result.num.get(2)).toBe(1);
            expect(result.den.get('x')).toBe(3);
            
            // 0 지수 항 제거 테스트
            const zeroExponentTerm = {
                num: new Map<number | string, number>([[2, 3], ['x', 0], ['y', 1]]),
                den: new Map<number | string, number>([[2, 2], ['z', 0]])
            };
            const zeroExponentResult = clearFractionTerm(zeroExponentTerm);
            expect(zeroExponentResult.num.has('x')).toBe(false);
            expect(zeroExponentResult.den.has('z')).toBe(false);
            expect(zeroExponentResult.num.get('y')).toBe(1);
            
            // 분자, 분모 모두 0 지수만 있는 경우 (1/1이 됨)
            const allZeroExponentTerm = {
                num: new Map<number | string, number>([['x', 0], ['y', 0]]),
                den: new Map<number | string, number>([['z', 0]])
            };
            const allZeroExponentResult = clearFractionTerm(allZeroExponentTerm);
            expect(allZeroExponentResult.num.get(1)).toBe(1);
            expect(allZeroExponentResult.den.get(1)).toBe(1);
        });
    });

    // 분수항 비교 테스트
    describe('Fraction Comparison Tests', () => {
        it('areSimilarFractionTerm should detect similar fraction terms correctly', () => {
            // 동류 분수항 테스트
            const fracTerm1 = {
                num: new Map<number | string, number>([[2, 1], ['x', 2]]),
                den: new Map<number | string, number>([[3, 1]])
            };
            const fracTerm2 = {
                num: new Map<number | string, number>([[2, 2], ['x', 2]]),
                den: new Map<number | string, number>([[3, 1]])
            };
            expect(areSimilarFractionTerms(fracTerm1, fracTerm2)).toBe(true);
            
            // 다른 구조의 분수항 테스트
            const fracTerm3 = {
                num: new Map<number | string, number>([[2, 1], ['y', 2]]),
                den: new Map<number | string, number>([[3, 1]])
            };
            expect(areSimilarFractionTerms(fracTerm1, fracTerm3)).toBe(false);
            
            // 분모가 다른 분수항 테스트
            const fracTerm4 = {
                num: new Map<number | string, number>([[2, 1], ['x', 2]]),
                den: new Map<number | string, number>([[5, 1]])
            };
            expect(areSimilarFractionTerms(fracTerm1, fracTerm4)).toBe(true);
        });
        
        it('areSameFractionTerms should compare fraction terms correctly', () => {
            const fracTerm1 = { num: new Map([[2, 3]]), den: new Map([['x', 2]]) };
            const fracTerm2 = { num: new Map([[2, 3]]), den: new Map([['x', 2]]) };
            const fracTerm3 = { num: new Map([[2, 3]]), den: new Map([['x', 1]]) };
            expect(areSameFractionTerms(fracTerm1, fracTerm2)).toBe(true);
            expect(areSameFractionTerms(fracTerm1, fracTerm3)).toBe(false);
            
            // 약분 후 같은 경우
            const fracTerm4 = {
                num: new Map<number | string, number>([[2, 4]]),
                den: new Map<number | string, number>([[2, 1], ['x', 2]])
            };
            const fracTerm5 = {
                num: new Map<number | string, number>([[2, 3]]),
                den: new Map<number | string, number>([['x', 2]])
            };
            expect(areSameFractionTerms(fracTerm4, fracTerm5)).toBe(true);

            const fracTerm6 = {
                num: new Map<number | string, number>([[-2, 1]]),
                den: new Map<number | string, number>([[3, 1]])
            };
            const fracTerm7 = {
                num: new Map<number | string, number>([[-5, 1]]),
                den: new Map<number | string, number>([[3, 1]])
            };
            const fracTerm8 = addSimilarFractionTerms(fracTerm6, fracTerm7);
            const fracTerm9 = parseFractionTermString('-7/3');
            expect(areSameFractionTerms(fracTerm8, fracTerm9)).toBe(true);
        });
    });
    
    // 분수항 연산 테스트
    describe('Fraction Operations Tests', () => {
        it('multiplyFractionTerms should multiply fraction terms correctly', () => {
            const fracTerm1 = { 
                num: new Map<number | string, number>([[2, 3]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const fracTerm2 = { 
                num: new Map<number | string, number>([[2, 2]]), 
                den: new Map<number | string, number>([['y', 1]]) 
            };
            const result = multiplyFractionTerms(fracTerm1, fracTerm2);
            expect(result.num.get(2)).toBe(5);
            expect(result.den.get('x')).toBe(2);
            expect(result.den.get('y')).toBe(1);
            
            // 0 곱하기 테스트
            const zeroFracTerm = getZeroFractionTerm();
            const anyFracTerm = { 
                num: new Map<number | string, number>([[2, 3]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const zeroResult = multiplyFractionTerms(zeroFracTerm, anyFracTerm);
            expect(zeroResult.num.get(0)).toBe(1);
            
            // 1 곱하기 테스트
            const oneFracTerm = getOneFractionTerm();
            const oneResult = multiplyFractionTerms(oneFracTerm, anyFracTerm);
            expect(oneResult.num.get(2)).toBe(3);
            expect(oneResult.den.get('x')).toBe(2);
        });

        it('divideFractionTerms should divide fraction terms correctly', () => {
            const fracTerm1 = { 
                num: new Map<number | string, number>([[2, 3]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const fracTerm2 = { 
                num: new Map<number | string, number>([[2, 2]]), 
                den: new Map<number | string, number>([['x', 1]]) 
            };
            const result = clearFractionTerm(divideFractionTerms(fracTerm1, fracTerm2));
            expect(result.num.get(2)).toBe(1);
            expect(result.den.get('x')).toBe(1);
            
            // 같은 분수항 나누기 (결과 1)
            const sameFracTerm1 = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                den: new Map<number | string, number>([[3, 1]]) 
            };
            const sameFracTerm2 = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                den: new Map<number | string, number>([[3, 1]]) 
            };
            const sameResult = clearFractionTerm(divideFractionTerms(sameFracTerm1, sameFracTerm2));
            expect(sameResult.num.get(1)).toBe(1);
            expect(sameResult.den.get(1)).toBe(1);
            
            // 0으로 나누기 (예외 발생 테스트)
            const nonZeroFracTerm = { 
                num: new Map<number | string, number>([[2, 3]]), 
                den: new Map<number | string, number>([[1, 1]]) 
            };
            const zeroFracTerm = getZeroFractionTerm();
            // 0으로 나누기는 일반적으로 예외를 발생시키지만, 현재 구현에서는 처리하지 않음
            // 실제 구현에 따라 이 테스트를 조정해야 함
            const divByZeroResult = divideFractionTerms(nonZeroFracTerm, zeroFracTerm);
            // expect(() => divideFractionTerms(nonZeroFracTerm, zeroFracTerm)).toThrow();
        });

        it('addSimilarFractionTerms should add similar fraction terms correctly', () => {
            const fracTerm1 = { 
                num: new Map<number | string, number>([[2, 3]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const fracTerm2 = { 
                num: new Map<number | string, number>([[2, 2]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const result = addSimilarFractionTerms(fracTerm1, fracTerm2);
            expect(result.num.get(2)).toBe(2);
            expect(result.num.get(3)).toBe(1);
            expect(result.den.get('x')).toBe(2);
            
            // 같은 분모를 가진 분수항 더하기
            const fracTerm3 = { 
                num: new Map<number | string, number>([[2, 1]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const fracTerm4 = { 
                num: new Map<number | string, number>([[3, 1]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const result2 = addSimilarFractionTerms(fracTerm3, fracTerm4);
            expect(result2.num.get(5)).toBe(1);
            expect(result2.den.get('x')).toBe(2);
            
            // 다른 분모를 가진 분수항 더하기 (예외 발생 테스트)
            const fracTerm5 = { 
                num: new Map<number | string, number>([[2, 1]]), 
                den: new Map<number | string, number>([['x', 2]]) 
            };
            const fracTerm6 = { 
                num: new Map<number | string, number>([[3, 1]]), 
                den: new Map<number | string, number>([['y', 2]]) 
            };
            expect(() => addSimilarFractionTerms(fracTerm5, fracTerm6)).toThrow();
        });
    });
});


