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
    meaning: string,
}

interface Review {
    vocaId: string,
    reviewCnt: number,
    reviewDate: Date,
}

type ResultMap = Map<string, boolean>;

type UserHistory = {
        level: number,
        cnt: number,
        date: Date
}

interface User {
    email: string,
    level: number,
    cnt: number,
    historyArr: UserHistory[] 
}

// export type {
//     Voca,
//     Quiz,
//     UserVoca,
//     User
// }
