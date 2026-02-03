import { fractionMath, decimalMath } from './math.js';

/**
 * [min, max] 범위의 정수 반환
 */
export function getRandomInt(min: number, max: number, allowZero = false): number {
    if (min > max) throw new Error('min cannot be greater than max');
    
    // 가능한 정수 존재 여부 체크 (0 제외 시)
    if (!allowZero && min === 0 && max === 0) {
        throw new Error('min and max cannot both be 0 when allowZero is false');
    }

    let random: number;
    do {
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!allowZero && random === 0);

    return random;
}

/**
 * [min, max] 범위의 실수 반환
 */
export function getRandomFloat(min: number, max: number, precision = 2, allowZero = false): number {
    if (min > max) throw new Error('min cannot be greater than max');
    if (!allowZero && min === 0 && max === 0) {
        throw new Error('min and max cannot both be 0 when allowZero is false');
    }

    let result: number;
    do {
        const random = Math.random() * (max - min) + min;
        result = parseFloat(random.toFixed(precision));
    } while (!allowZero && result === 0);

    return result;
}

const symbolArr = ['', 'x', 'y', 'z', 'a'];
export function getRandomSymbol(min: number, max: number): string {
    if (min > max) throw new Error('min cannot be greater than max');
    if (max >= symbolArr.length) throw new Error('max exceeds available symbols');
    return symbolArr[getRandomInt(min, max)];
}

export type NumberType = 'F' | 'D';

/**
 * 유리수 항의 Tex 정리 (부호 위치 및 괄호 최적화)
 */
export function getCleanTex(termStr: string, type: NumberType): string {
    if (type === 'F') {
        const f = fractionMath.simplifyCore(termStr);
        let tex = f.toTex();
        
        // \frac{-2}{5} -> -\frac{2}{5} 보정
        // 정규식을 사용하여 분자 위치의 음수만 정확히 캐치합니다.
        if (tex.includes('\\frac{-')) {
            tex = tex.replace('\\frac{-', '-\\frac{');
        }
        return tex;
    }
    return decimalMath.simplifyCore(termStr).toTex();
}

// utils.ts

/**
 * 특정 요소들(elements)을 무작위로 섞어 termCnt 길이의 패턴을 생성합니다.
 * 모든 요소가 최소 한 번씩은 포함되도록 보장합니다.
 */
export function generateRandomPattern<T>(elements: T[], termCnt: number): T[] {
    if (elements.length === 0) return [];
    
    let pattern: T[] = [];
    
    // 1. 모든 요소를 최소 하나씩 추가
    elements.forEach(el => pattern.push(el));
    
    // 2. 남은 자리를 무작위 요소로 채움
    while (pattern.length < termCnt) {
        const randomEl = elements[getRandomInt(0, elements.length - 1)];
        pattern.push(randomEl);
    }
    
    // 3. Fisher-Yates Shuffle로 무작위 섞기
    for (let i = pattern.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pattern[i], pattern[j]] = [pattern[j], pattern[i]];
    }
    
    return pattern.slice(0, termCnt); // 혹시 모를 길이 초과 방지
}

/**
 * 분수 항 생성 (분모 0 방지 및 고정 분모 지원)
 */
export function generateFractionTerm(numMin: number, numMax: number, denMin: number, denMax: number, fixedDen?: number) {
    // 1. 분모/분자 결정
    const den = fixedDen ?? getRandomInt(denMin === 0 ? 1 : denMin, denMax, false);
    const num = getRandomInt(numMin, numMax);
    
    // 2. TeX는 기존 getCleanTex를 그대로 사용 (가독성 유지)
    const tex = getCleanTex(`(${num}/${den})`, 'F');

    return {
        tex: tex,
        // [핵심 수정] simplifyCore를 거치지 않고 직접 문자열 생성
        // 이렇게 해야 "7/1 / 5/1" 같은 중첩 슬래시가 발생하지 않습니다.
        str: `${num}/${den}`, 
        num: num,
        den: den
    };
}

/**
 * 요청된 레벨에 맞는 설정(config)을 반환합니다.
 * 레벨 초과 시 랜덤하게 설정을 선택하여 '단원 평가' 모드를 지원합니다.
 */
export function getQuizConfig<T>(requestedLevel: number, configs: Record<number, T>): [number, T] {
    const maxLevel = Object.keys(configs).length;
    
    // 레벨 초과 시 1 ~ maxLevel 중 랜덤, 아니면 요청 레벨 사용
    const activeLevel = requestedLevel > maxLevel 
        ? getRandomInt(1, maxLevel) 
        : requestedLevel;

    return [activeLevel, configs[activeLevel]];
}