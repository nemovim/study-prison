import GeneralManager from '$lib/server/generalManager';
import type { Actions } from './$types';

export async function load({ locals, parent }) {
    if (locals.user.cnt < 20) {
        // First Quiz == New User
        const levelTest = await GeneralManager.getLevelTest(locals.user);
        return {
            reviewArr: JSON.stringify(levelTest.reviewArr),
            vocaArr: JSON.stringify(levelTest.vocaArr),
            isLevelTest: true,
        };
    } else {
        const reviewArr = await GeneralManager.getReviewArrByUser(locals.user, 10);
        const vocaArr = await GeneralManager.getVocaArrByReviewArr(reviewArr);
        return {
            reviewArr: JSON.stringify(reviewArr),
            vocaArr: JSON.stringify(vocaArr),
            isLevelTest: false,
        }
    }
}

// export const actions = {
//     default: async ({ request }) => {
//         const data = await request.formData();
//         const answer = String(data.get('answer'));
//         return {
//             success: true,
//             result: quizMachine.checkAnswer(answer),
//             quiz: quizMachine.getNextQuiz(),
//         }
//     }
// } satisfies Actions