export interface QuizModule {
    grade: number;
    section: number;
    name: string;
    maxLevel: number;
    makeQuiz: (level: number) => { quiz: string, answer: string };
}
