import {
    clearExpression,
    addSimilarFractionTermsInExpression,
    distributeExpressionByFractionTerm,
    distributeExpressionByExpression,
    stringifyTerm,
    stringifyFractionTerm,
    stringifyExpression,
    parseSymbolicTermString,
    parseFractionTermString,
    parseExpressionString,
    areSameExpressionStrings,
    getZeroFractionTerm,
    getOneFractionTerm,
    type FractionTerm,
    type Expression
} from '../utils';

import { describe, it, expect } from 'vitest';

describe('Expression Tests', () => {
    // 수식 처리 테스트
    describe('Expression Processing Tests', () => {
        it('clearExpression should remove zero terms correctly', () => {
            // 기본 테스트
            const expr: Expression = [
                { num: new Map([[0, 1]]), den: new Map([[1, 1]]) },
                { num: new Map([[2, 1]]), den: new Map([[1, 1]]) }
            ];
            const result = clearExpression(expr);
            expect(result.length).toBe(1);
            expect(result[0].num.get(2)).toBe(1);
            
            // 모든 항이 0인 경우 (0 반환)
            const allZeroExpr: Expression = [
                { num: new Map([[0, 1]]), den: new Map([[1, 1]]) },
                { num: new Map([[0, 1]]), den: new Map([[1, 1]]) }
            ];
            const allZeroResult = clearExpression(allZeroExpr);
            expect(allZeroResult.length).toBe(1);
            expect(allZeroResult[0].num.get(0)).toBe(1);
        });
        
        it('clearExpression should clear negative powers correctly', () => {
            const expr: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 3], ['x', -2]]), 
                    den: new Map<number | string, number>([[3, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[2, 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const result = clearExpression(expr);
            expect(result[0].num.get(2)).toBe(3);
            expect(result[0].den.get('x')).toBe(2);
            expect(result[0].den.get(3)).toBe(1);
            expect(result[1].num.get(2)).toBe(1);
        });
        
        it('addSimilarFractionTermsInExpression should combine similar terms correctly', () => {
            const expr: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 1], ['x', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[3, 1], ['x', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[5, 1], ['y', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const result = addSimilarFractionTermsInExpression(expr);
            expect(result.length).toBe(2); // 2개의 항으로 합쳐짐
            
            // 동류항이 없는 경우
            const uniqueExpr: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 1], ['x', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[3, 1], ['y', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const uniqueResult = addSimilarFractionTermsInExpression(uniqueExpr);
            expect(uniqueResult.length).toBe(2); // 변화 없음
        });
    });
    
    // 분배법칙 테스트
    describe('Distribution Tests', () => {
        it('distributeByTerm should apply distributive property correctly', () => {
            const coefFracTerm: FractionTerm = { 
                num: new Map<number | string, number>([[2, 1]]), 
                den: new Map<number | string, number>([[1, 1]]) 
            };
            const expr: Expression = [
                { 
                    num: new Map<number | string, number>([[3, 1], ['x', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[5, 1], ['y', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const result = distributeExpressionByFractionTerm(coefFracTerm, expr);
            expect(result.length).toBe(2);
            expect(result[0].num.get(2)).toBe(1);
            expect(result[0].num.get(3)).toBe(1);
            expect(result[0].num.get('x')).toBe(1);
            expect(result[1].num.get(2)).toBe(1);
            expect(result[1].num.get(5)).toBe(1);
            expect(result[1].num.get('y')).toBe(1);
            
            // 0 분배
            const zeroCoef = getZeroFractionTerm();
            const zeroResult = clearExpression(distributeExpressionByFractionTerm(zeroCoef, expr));
            expect(zeroResult.length).toBe(1);
            expect(zeroResult[0].num.get(0)).toBe(1);
            
            // 1 분배
            const oneCoef = getOneFractionTerm();
            const oneResult = distributeExpressionByFractionTerm(oneCoef, expr);
            expect(oneResult.length).toBe(2);
            expect(oneResult[0].num.get(3)).toBe(1);
            expect(oneResult[0].num.get('x')).toBe(1);
        });
        
        it('distributeByExpression should distribute expressions correctly', () => {
            const expr1: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[3, 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const expr2: Expression = [
                { 
                    num: new Map<number | string, number>([['x', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([['y', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const result = distributeExpressionByExpression(expr1, expr2);
            expect(result.length).toBe(4); // 2x2=4 항
            
            // 빈 수식 분배
            const emptyExpr: Expression = [];
            const emptyResult = distributeExpressionByExpression(expr1, emptyExpr);
            expect(emptyResult.length).toBe(0);
        });
    });
    
    // 문자열 변환 테스트
    describe('String Conversion Tests', () => {
        it('stringifyTerm should convert terms to strings correctly', () => {
            const term = new Map<number | string, number>([[2, 3], [3, 1], ['x', 2], ['y', 1]]);
            const result = stringifyTerm(term, false);
            expect(result).toContain('2^3');
            expect(result).toContain('3');
            expect(result).toContain('x^2');
            expect(result).toContain('y');
            
            // 숫자 계산 테스트
            const calcResult = stringifyTerm(term, true);
            expect(calcResult).toContain('24');
            expect(calcResult).toContain('x^2');
            expect(calcResult).toContain('y');
            
            // 단일 항 테스트
            const singleTerm = new Map<number | string, number>([[2, 1]]);
            const singleResult = stringifyTerm(singleTerm);
            expect(singleResult).toBe('+2');
        });
        
        it('stringifyFractionTerm should convert fraction terms to strings correctly', () => {
            const fracTerm: FractionTerm = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                den: new Map<number | string, number>([[3, 1], ['y', 1]]) 
            };
            const result = stringifyFractionTerm(fracTerm);
            expect(result).toContain('8');
            expect(result).toContain('x^2');
            expect(result).toContain('3');
            expect(result).toContain('y');
            
            // 분모가 1인 경우
            const noFracTerm: FractionTerm = { 
                num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                den: new Map<number | string, number>([[1, 1]]) 
            };
            const noFracResult = stringifyFractionTerm(noFracTerm);
            expect(noFracResult).not.toContain('/');
        });
        
        it('stringifyExpression should convert expressions to strings correctly', () => {
            const expr: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                },
                { 
                    num: new Map<number | string, number>([[3, 1], ['y', 1]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const result = stringifyExpression(expr);
            expect(result).toContain('8');
            expect(result).toContain('x^2');
            expect(result).toContain('3');
            expect(result).toContain('y');
            expect(result).toContain('+');
            
            // 단일 항 수식
            const singleExpr: Expression = [
                { 
                    num: new Map<number | string, number>([[2, 3], ['x', 2]]), 
                    den: new Map<number | string, number>([[1, 1]]) 
                }
            ];
            const singleResult = stringifyExpression(singleExpr);
            // 수식은 항상 + 또는 - 부호로 시작해야 함
            expect(singleResult.startsWith('+')).toBe(true);
        });
    });
    
    // 문자열 파싱 테스트
    describe('String Parsing Tests', () => {
        it('parseSymbolicTermString should parse symbolic terms correctly', () => {
            const symbolicTermString = '+x^2y';
            const result = parseSymbolicTermString(symbolicTermString);
            expect(result.get('x')).toBe(2);
            expect(result.get('y')).toBe(1);
            
            // 복잡한 항 테스트
            const complexTermString = '+x^3y^2z';
            const complexResult = parseSymbolicTermString(complexTermString);
            expect(complexResult.get('x')).toBe(3);
            expect(complexResult.get('y')).toBe(2);
            expect(complexResult.get('z')).toBe(1);
        });
        
        it('parseFractionTermString should parse fraction terms correctly', () => {
            const fracTermString = '+(4/3)x^2';
            const result = parseFractionTermString(fracTermString);
            expect(result.num.get(2)).toBe(2);
            expect(result.num.get('x')).toBe(2);
            expect(result.den.get(3)).toBe(1);
            
            // 분수가 아닌 항 테스트
            const nonFracTermString = '+2x';
            const nonFracResult = parseFractionTermString(nonFracTermString);
            expect(nonFracResult.num.get(2)).toBe(1);
            expect(nonFracResult.num.get('x')).toBe(1);
            expect(nonFracResult.den.get(1)).toBe(1);
        });
        
        it('parseExpressionString should parse expressions correctly', () => {
            const exprString = '8x^2+3y';
            const result = parseExpressionString(exprString);
            expect(result.length).toBe(2);
            expect(result[0].num.get(2)).toBe(3);
            expect(result[0].num.get('x')).toBe(2);
            expect(result[1].num.get(3)).toBe(1);
            expect(result[1].num.get('y')).toBe(1);
            
            // 단일 항 수식 테스트
            const singleExprString = '2x';
            const singleResult = parseExpressionString(singleExprString);
            expect(singleResult.length).toBe(1);
            expect(singleResult[0].num.get(2)).toBe(1);
            expect(singleResult[0].num.get('x')).toBe(1);
        });
    });
    
    // 수식 비교 테스트
    describe('Expression Comparison Tests', () => {
        it('areSameExpressionStrings should compare expressions correctly', () => {
            // First clear the expressions before comparing
            const expr1 = clearExpression(parseExpressionString('2x+3y'));
            const expr2 = clearExpression(parseExpressionString('2x+3y'));
            const expr3 = clearExpression(parseExpressionString('3y+2x'));
            const expr4 = clearExpression(parseExpressionString('2x+4y'));
            const expr5 = clearExpression(parseExpressionString('2x+3y+z'));
            
            // 같은 수식 테스트
            expect(areSameExpressionStrings(stringifyExpression(expr1), stringifyExpression(expr2))).toBe(true);
            
            // 순서가 다른 수식 테스트
            expect(areSameExpressionStrings(stringifyExpression(expr1), stringifyExpression(expr3))).toBe(true);
            
            // 다른 수식 테스트
            expect(areSameExpressionStrings(stringifyExpression(expr1), stringifyExpression(expr4))).toBe(false);
            
            // 항의 개수가 다른 수식 테스트
            expect(areSameExpressionStrings(stringifyExpression(expr1), stringifyExpression(expr5))).toBe(false);
        });
    });
});
