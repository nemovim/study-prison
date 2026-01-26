import { create, all } from 'mathjs';

const fractionMath = create(all, {
    number: 'Fraction',
    predictable: true,
})

const decimalMath = create(all, {
    number: 'BigNumber',
    precision: 64,
    predictable: true,
})

export { fractionMath, decimalMath };