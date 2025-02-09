import { shuffleArr } from '$lib/utils/utils';

export default class QuizMachine {
    #vocaArr: Voca[] = [];
    #reviewMap: Map<string, Review> = new Map();
    #answerArr: string[][] = [];
    #wrongVocaArr: Voca[] = [];
    #quizArr: Quiz[] = [];
    idx: number = -1;

    constructor() {
    }

    init(reviewArr: Review[], vocaArr: Voca[]) {
        this.#vocaArr = vocaArr;
        reviewArr.forEach((review) => {
            this.#reviewMap.set(review.vocaId, review)
        })
        this.shuffleVocaArr();
    }

    #setQuizAndAnswer() {
        this.#quizArr = [];
        this.#answerArr = [];
        this.#vocaArr.forEach(voca => {
            this.#quizArr.push(this.#makeQuiz(voca));
            this.#answerArr.push(this.#makeAnswer(voca));
        });
    }

    #makeQuiz(voca: Voca): Quiz {
        let splittedExample = voca['example'].split('*');
        splittedExample[1] = '______';
        const parsed_example = splittedExample.join('');

        const parsed_translation = voca['translation'].replaceAll('*', '\"');

        return {
            example: parsed_example,
            translation: parsed_translation,
            level: voca['level'],
            pronunciation: voca['pronunciation'],
        };
    }

    #makeAnswer(voca: Voca): string[] {
        const splittedExample = voca['example'].split('*');
        const answerArr = [voca['word'], splittedExample[1], ...voca['acceptedWords']].map(answer => {
            return answer.toLowerCase()
        });
        return Array.from(new Set(answerArr))

    }

    isCorrectAnswer(answer: string): boolean {
        if (this.#vocaArr.length === 0) return false;
        if (this.#answerArr[this.idx].indexOf(answer) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    getAnswerArr(): string[] {
        return this.#answerArr[this.idx];
    }

    getQuizArr() {
        return this.#quizArr;
    }

    quizEnds(): boolean {
        if (this.idx + 1 >= this.#quizArr.length && this.#wrongVocaArr.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    async guessCorrectAnswer() {
        // Fetch the post request
        const result = await fetch('/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                review: this.#reviewMap.get(this.#vocaArr[this.idx]._id),
                result: true,
            })
        })
        this.#reviewMap.set(this.#vocaArr[this.idx]._id, await result.json());
    }

    async guessWrongAnswer() {
        this.#wrongVocaArr.push(this.#vocaArr[this.idx]);
        const result = await fetch('/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                review: this.#reviewMap.get(this.#vocaArr[this.idx]._id),
                result: false,
            })
        });
        this.#reviewMap.set(this.#vocaArr[this.idx]._id, await result.json());
    }

    shuffleVocaArr() {
        shuffleArr(this.#vocaArr);
        this.#setQuizAndAnswer();
    }

    getNextQuiz(): Quiz {
        this.idx += 1;
        if (this.idx >= this.#quizArr.length) {
            this.#vocaArr = this.#wrongVocaArr;
            this.#wrongVocaArr = [];
            this.shuffleVocaArr();
            this.idx = 0;
        }
        return this.#quizArr[this.idx];
    }

    getNextQuizForLevelTest(lastQuiz: Quiz | undefined, result:boolean): Quiz | null {
        let lastLevel: number;

        if (lastQuiz === undefined) {
            lastLevel = this.#vocaArr.reduce((prev, voca) => {
                if (voca.level < prev) {
                    return voca.level;
                } else {
                    return prev;
                }
            }, 10);
            result = true;
        } else {
            lastLevel = lastQuiz.level;
            this.#quizArr.splice(this.idx, 1);
            this.#answerArr.splice(this.idx, 1);
        }

        let nextQuiz: Quiz | null = null;
        if (result) {
            this.#quizArr.forEach((quiz, idx:number) => {
                if (quiz.level > lastLevel && quiz.level <= lastLevel+1) {
                    this.idx = idx;
                    nextQuiz = quiz;
                }
            });
        } else {
            this.#quizArr.forEach((quiz, idx:number) => {
                if (quiz.level < lastLevel && quiz.level >= lastLevel-1) {
                    this.idx = idx;
                    nextQuiz = quiz;
                }
            });
        }

        return nextQuiz;
    }
}