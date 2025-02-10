export function shuffleArr(arr: any[]) {
    for (let i = arr.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

export const reviewDeltaSecMap = new Map<number, number>([
    [0, 0],
    [1, 60 * 10],
    [2, 3600 * 12],
    [3, 3600 * 24 * 2],
    [4, 3600 * 24 * 7],
    [5, 3600 * 24 * 30],
    [6, 3600 * 24 * 60],
    [7, 3600 * 24 * 180],
    [8, 3600 * 24 * 365],
]);

export const reviewDeltaNameMap = new Map<number, string>([
    [0, '잠시'],
    [1, '10분'],
    [2, '12시간'],
    [3, '2일'],
    [4, '7일'],
    [5, '한 달'],
    [6, '두 달'],
    [7, '반 년'],
    [8, '일 년'],
]);