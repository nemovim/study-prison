// export type Branded<T, K> = T & { _brand: K };
export type Term = [number, string]
export type Expression = Term[]

// Remove zeros
export function clearExpression(expr: Expression): Expression {
    const newExpr = expr.filter(term => term[0] !== 0);
    if (newExpr.length === 0) return [[0, '']];
    else return newExpr;
}

// 동류항 계산
export function addSimilarTerms(expr: Expression): Expression {
    const newExpr: Expression = [];
    const xArr: string[] = [];

    expr.forEach(term => {
        const idx = xArr.indexOf(term[1]);
        if (idx === -1) {
            xArr.push(term[1]);
            newExpr.push(term);
        } else {
            newExpr[idx][0] += term[0];
        }
    });

    return newExpr;
}

export function multiplyTerms(term1: Term, term2: Term): Term {
    return [term1[0] * term2[0], (term1[1] + term2[1]).split('').toSorted().join('')];
}

// 분배법칙 적용 // x*x => xx // xx * x => xxx // x*y => xy // x*'' => x
export function distributeByTerm(coefTerm: Term, expr: Expression): Expression {
    const newExpr = expr.reduce((prev, term) => {
        prev.push(multiplyTerms(coefTerm, term));
        return prev;
    }, [] as Expression)
    return newExpr;
}

export function distributeByExpression(expr1: Expression, expr2: Expression): Expression {
    const newExpr = expr1.reduce((prev, term) => {
        const newTerm = distributeByTerm(term, expr2);
        prev.push(...newTerm);
        return prev;
    }
    , [] as Expression)
    return newExpr;
}

// xxyy -> x^2y^2
export function stringifySymbol(symbols: string): string {
    if (symbols === '')
        return '';

    const symbolArr = symbols.split('').toSorted();
    symbolArr.push('');

    let result = '';

    let prevSymbol = '';
    let cnt = 1;
    symbolArr.forEach(symbol => {
        if (prevSymbol === symbol) {
            cnt += 1;
        } else {
            if (cnt === 1)
                result += prevSymbol;
            else result += prevSymbol + '^' + cnt;

            prevSymbol = symbol;
            cnt = 1;
        }
    });

    return result;
}

// Term -> string
export function stringifyTerm(term: Term): string {
    let result = '';
    if (term[0] > 0) {
        // positive
        if (term[0] === 1 && term[1] !== '') {
            // omit 1 in front of the symbol
            result = '+' + stringifySymbol(term[1]);
        } else {
            result = '+' + term[0] + stringifySymbol(term[1]);
        }
    } else if (term[0] < 0) {
        // negative
        if (term[0] === -1 && term[1] !== '') {
            // omit 1 in front of the symbol
            result = '-' + stringifySymbol(term[1]);
        } else {
            result = term[0] + stringifySymbol(term[1]);
        }
    } else {
        // zero
        result = '+0';
    }
    return result;
}

// Expression -> string
export function stringifyExpression(expr: Expression, isQuiz = false): string {
    if (!isQuiz)
        expr = clearExpression(expr);
    let result = expr.reduce((prev, term) => prev + stringifyTerm(term), '');
    if (result.startsWith('+')) result = result.slice(1);
    return result;
}

export function parseSymbolString(symbolString: string): string {
    if (symbolString === '') return ''

    const symbolArr: string[] = [];
    console.log(symbolString);

    (symbolString.match(/[a-zA-Z](?:\^[0-9]+)?/g)||[]).forEach(symbol => {
        symbolArr.push(symbol.split('^')[0].repeat(Number(symbol.split('^')[1] || 1)));
    });

    console.log(symbolArr)

    return symbolArr.toSorted().join('');
}

export function parseTermString(termString: string): Term {
    const rawTermArr = (termString.match(/^((?:\+|-)[0-9]*)((?:[a-zA-Z](?:\^[0-9]+)?)*)$/) || []).slice(1, 3);
    if (rawTermArr[0] === '+') rawTermArr[0] = '+1';
    if (rawTermArr[0] === '-') rawTermArr[0] = '-1';
    console.log(rawTermArr);
    return [Number(rawTermArr[0] || 0), parseSymbolString(rawTermArr[1] || '')];
}

// Expression을 termArr로
export function parseExpressionString(exprString: string): Expression {
    if (exprString === '') return [];

    if (!exprString.startsWith('-') && !exprString.startsWith('+')) {
        exprString = '+' + exprString;
    }


    console.log(exprString)
    const termStringArr = (exprString.match(/(?:\+|-)[0-9]*(?:[a-zA-Z](?:\^[0-9]+)?)*/g) || [])

    console.log(termStringArr)

    return termStringArr.map(termString => parseTermString(termString)).toSorted();
}

export function isSameTerm(term1: Term, term2: Term): boolean {
    return term1[0] === term2[0] && term1[1] === term2[1];
}

export function isSameExpressionString(exprString1: string, exprString2: string): boolean {
    console.log(exprString1);
    console.log(exprString2);

    const expr1 = clearExpression(parseExpressionString(exprString1));
    const expr2 = clearExpression(parseExpressionString(exprString2));

    console.log(expr1);
    console.log(expr2);

    if (expr1.length != expr2.length) return false;

    for (let i = 0; i < expr1.length; i++) {
        if (!isSameTerm(expr1[i], expr2[i])) return false;
    }

    return true;
}

// return random number in the close interval [min, max] 
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const letterArr = ['', 'x', 'y', 'z', 'a'];
export function getRandomLetter(min: number, max: number): string {
    return letterArr[getRandomInt(min, max)];
}

export function getRandomExpression(cnt: number, intMin = -9, intMax = 9, letterMin = 0, letterMax = 2, letterPower = 1): Expression {
    let expr: Expression = [];
    for (let i = 0; i < cnt; i++) {
        expr.push([getRandomInt(intMin, intMax), getRandomLetter(letterMin, letterMax).repeat(letterPower)]);
    }
    return expr;
}