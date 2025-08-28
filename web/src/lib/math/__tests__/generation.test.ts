import {
    getRandomInt,
    getRandomSymbol,
    getRandomTerm,
    getRandomFractionTerm,
    getRandomExpression,
    type GenerationConfig
} from '../utils';

import { describe, it, expect } from 'vitest';

describe('Generation Tests', () => {
    describe('Random Generation Tests', () => {
        it('getRandomInt should generate numbers within range', () => {
            const min = -5;
            const max = 5;
            const result = getRandomInt(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
        });

        it('getRandomInt should handle zero exclusion correctly', () => {
            const result = getRandomInt(-5, 5, false);
            expect(result).not.toBe(0);
        });

        it('getRandomSymbol should generate symbols from array', () => {
            const symbols = ['', 'x', 'y', 'z', 'a'];
            const result = getRandomSymbol(0, symbols.length - 1);
            expect(symbols).toContain(result);
        });

        it('getRandomTerm should generate valid terms', () => {
            const config: GenerationConfig = {
                numIntMin: -5,
                numIntMax: 5,
                symbolMin: 0,
                symbolMax: 4,
                symbolPowerMin: 1,
                symbolPowerMax: 3,
                symbolCnt: 2,
                termCnt: 1
            };
            const term = getRandomTerm(config);
            expect(term.size).toBeGreaterThan(0);
            expect(Array.from(term.values()).every(v => typeof v === 'number')).toBe(true);
        });

        it('getRandomFractionTerm should generate valid fraction terms', () => {
            const config: GenerationConfig = {
                numIntMin: -5,
                numIntMax: 5,
                symbolMin: 0,
                symbolMax: 4,
                symbolPowerMin: 1,
                symbolPowerMax: 3,
                symbolCnt: 2,
                termCnt: 1
            };
            const fracTerm = getRandomFractionTerm(config);
            expect(fracTerm.num.size).toBeGreaterThan(0);
            expect(fracTerm.den.size).toBeGreaterThan(0);
        });

        it('getRandomExpression should generate valid expressions', () => {
            const config: GenerationConfig = {
                numIntMin: -5,
                numIntMax: 5,
                symbolMin: 0,
                symbolMax: 4,
                symbolPowerMin: 1,
                symbolPowerMax: 3,
                symbolCnt: 2,
                termCnt: 3
            };
            const expr = getRandomExpression(config);
            expect(expr.length).toBe(config.termCnt);
            expr.forEach(fracTerm => {
                expect(fracTerm.num.size).toBeGreaterThan(0);
                expect(fracTerm.den.size).toBeGreaterThan(0);
            });
        });
    });
});
