import {
    getZeroTerm,
    getOneTerm,
    getZeroFractionTerm,
    getOneFractionTerm,
    isZeroTerm,
    isOneTerm,
    type Term,
    type FractionTerm,
    type Expression
} from '../utils';

import { describe, it, expect } from 'vitest';

/**
 * 수학 유틸리티의 핵심 함수 테스트
 * 기본 항과 분수항 생성 함수들의 동작을 검증
 */
describe('핵심 함수 테스트', () => {
    /**
     * 기본 항 생성 함수 테스트
     */
    describe('기본 항 생성 함수 테스트', () => {
        it('getZeroTerm은 0^1을 포함한 항을 반환해야 함', () => {
            const zeroTerm = getZeroTerm();
            expect(zeroTerm.get(0)).toBe(1);
            expect(zeroTerm.size).toBe(1);
            expect(isZeroTerm(zeroTerm)).toBe(true);
        });

        it('getOneTerm은 1^1을 포함한 항을 반환해야 함', () => {
            const oneTerm = getOneTerm();
            expect(oneTerm.get(1)).toBe(1);
            expect(oneTerm.size).toBe(1);
            expect(isOneTerm(oneTerm)).toBe(true);
        });
    });

    /**
     * 기본 분수항 생성 함수 테스트
     */
    describe('기본 분수항 생성 함수 테스트', () => {
        it('getZeroFractionTerm은 0/1 형태의 분수항을 반환해야 함', () => {
            const zeroFracTerm = getZeroFractionTerm();
            expect(zeroFracTerm.num.get(0)).toBe(1);
            expect(zeroFracTerm.den.get(1)).toBe(1);
            expect(zeroFracTerm.num.size).toBe(1);
            expect(zeroFracTerm.den.size).toBe(1);
            expect(isZeroTerm(zeroFracTerm.num)).toBe(true);
            expect(isOneTerm(zeroFracTerm.den)).toBe(true);
        });

        it('getOneFractionTerm은 1/1 형태의 분수항을 반환해야 함', () => {
            const oneFracTerm = getOneFractionTerm();
            expect(oneFracTerm.num.get(1)).toBe(1);
            expect(oneFracTerm.den.get(1)).toBe(1);
            expect(oneFracTerm.num.size).toBe(1);
            expect(oneFracTerm.den.size).toBe(1);
            expect(isOneTerm(oneFracTerm.num)).toBe(true);
            expect(isOneTerm(oneFracTerm.den)).toBe(true);
        });
    });

    /**
     * 항 검사 함수 테스트
     */
    describe('항 검사 함수 테스트', () => {
        it('isZeroTerm은 0 항을 올바르게 식별해야 함', () => {
            // 0^1 항은 0으로 인식
            const zeroTerm = getZeroTerm();
            expect(isZeroTerm(zeroTerm)).toBe(true);
            
            // 다른 항은 0이 아님
            const nonZeroTerm: Term = new Map([[1, 1]]);
            expect(isZeroTerm(nonZeroTerm)).toBe(false);
            
            // 0을 포함하지만 다른 인수도 있는 항은 0이 아님
            const mixedTerm: Term = new Map([[0, 1], [1, 1]]);
            expect(isZeroTerm(mixedTerm)).toBe(false);
        });

        it('isOneTerm은 1 항을 올바르게 식별해야 함', () => {
            // 1^1 항은 1로 인식
            const oneTerm = getOneTerm();
            expect(isOneTerm(oneTerm)).toBe(true);
            
            // 다른 항은 1이 아님
            const nonOneTerm: Term = new Map([[2, 1]]);
            expect(isOneTerm(nonOneTerm)).toBe(false);
            
            // 1을 포함하지만 다른 인수도 있는 항은 1이 아님
            const mixedTerm: Term = new Map([[1, 1], [2, 1]]);
            expect(isOneTerm(mixedTerm)).toBe(false);
            
            // 1^2 항은 1이 아님 (지수가 1이 아님)
            const onePoweredTerm: Term = new Map([[1, 2]]);
            expect(isOneTerm(onePoweredTerm)).toBe(false);
        });
    });
});
