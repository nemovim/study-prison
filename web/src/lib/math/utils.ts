// return random number in the closed interval [min, max]
export function getRandomInt(min: number, max: number, allowZero = true): number {
    if (min > max) throw new Error('min cannot be greater than max');
    
    // 0을 제외했는데 가능한 정수가 없는 경우 체크
    if (!allowZero && min === 0 && max === 0) {
        throw new Error('min and max cannot both be 0 when allowZero is false');
    }

    let random: number;
    do {
        // [min, max] 범위의 정수를 균등하게 생성
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!allowZero && random === 0);

    return random;
}

export function getRandomFloat(min: number, max: number, precision = 2, allowZero = true): number {
    if (min > max) throw new Error('min cannot be greater than max');
    
    // 0을 허용하지 않는데 범위 내에 0만 가능한 경우 예외 처리
    if (!allowZero && min === 0 && max === 0) {
        throw new Error('min and max cannot both be 0 when allowZero is false');
    }

    let result: number;
    
    do {
        // 1. 랜덤 값 생성
        const random = Math.random() * (max - min) + min;
        // 2. 지정된 정밀도로 반올림
        result = parseFloat(random.toFixed(precision));
        
        // 3. allowZero가 false인 경우, 결과가 0이면 다시 시도
    } while (!allowZero && result === 0);

    return result;
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