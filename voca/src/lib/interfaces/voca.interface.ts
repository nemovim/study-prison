interface Voca {
    _id: string,
    word: string,
    meaning: string,
    example: string,
    translation: string,
    pronunciation: string,
    level: number,
    acceptedWords: string[],
    oxArr: number[]
}

interface Quiz {
    example: string,
    translation: string,
    level: number,
    pronunciation: string,
}

interface Review {
    vocaId: string,
    reviewCnt: number,
    reviewDate: number,
}

type ResultMap = Map<string, boolean>;

interface User {
    email: string,
    level: number,
    cnt: number,
}

// export type {
//     Voca,
//     Quiz,
//     UserVoca,
//     User
// }
