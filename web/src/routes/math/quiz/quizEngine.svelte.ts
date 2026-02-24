import { isCorrect } from "$lib/math/quiz";
import { page } from "$app/state";
import { getQuizModule } from "$lib/math/quiz";
import type { QuizModule } from "$lib/math/types";

const emptyQuizModule: QuizModule = {
    grade: -1,
    section: -1,
    name: "",
    maxLevel: 0,
    makeQuiz: () => ({ quiz: "", answer: "" }),
};

export function createQuizEngine(scorePerLevel: number) {
    const params = page.url.searchParams;

    const grade = Number(params.get("grade"));
    const section = Number(params.get("section"));
    const isTest = params.get("isTest") === "true";
    const practiceLevel = Number(params.get("practice") ?? 0);
    const startLevel = Number(params.get("level") ?? 1);
    const initialScore = params.get("score") !== null
        ? Number(params.get("score"))
        : (startLevel - 1) * scorePerLevel;

    let quizModule = getQuizModule(grade, section) ?? emptyQuizModule;

    let score = $state(initialScore);
    let wrongCnt = $state(0);
    let quizCnt = $state(0);

    let quizString = $state("");
    let quizAnswer = $state("");

    let isRetry = $state(false);
    let lastUserAnswer = $state('');


    let level = $derived.by(() => {
        if (isTest) return quizModule.maxLevel + 1;
        if (practiceLevel > 0) return practiceLevel;

        const calculatedLevel = Math.floor(score / scorePerLevel) + 1;
        return Math.max(1, Math.min(calculatedLevel, quizModule.maxLevel + 1));
    });

    const getNextQuiz = () => {
        const { quiz, answer } = quizModule.makeQuiz(level);
        quizString = quiz;
        quizAnswer = answer;
        quizCnt += 1;
    };

    return {
        // 상태 getter
        get score() { return score; },
        get wrongCnt() { return wrongCnt; },
        get quizCnt() { return quizCnt; },
        get isRetry() { return isRetry; },
        get quizString() { return quizString; },
        get quizAnswer() { return quizAnswer; },
        get level() { return level; },
        get maxLevel() { return quizModule.maxLevel; },
        get practiceLevel() { return practiceLevel; },
        get name() { return quizModule.name; },

        // 메서드
        getNextQuiz,
        submit: (userAnswer: string) => {
            const correct = isCorrect(userAnswer.trim(), quizAnswer);
            if (correct) {
                if (!isRetry) {
                    score += 1;
                    return { type: 'success', isFirstTry: true };
                } else {
                    isRetry = false;
                    return { type: 'success', isFirstTry: false };
                }
            } else {
                if (!isRetry || lastUserAnswer === userAnswer.trim()) {
                    lastUserAnswer = userAnswer.trim();
                    isRetry = true;
                    return { type: 'retry' };
                } else {
                    score -= 2;
                    wrongCnt += 1;
                    isRetry = false;
                    return { type: 'fail' };
                }
            }
        }
    };
}