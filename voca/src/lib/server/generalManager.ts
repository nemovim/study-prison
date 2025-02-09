import review from '$lib/models/review';
import ReviewManager from './reviewManager';
import UserManager from './userManager';
import VocaManager from './vocaManager';

export default class GeneralManager {

    static async getUserByEmail(email: string) {
        return await UserManager.getUserByEmail(email);
    }

    static async addNewUserByEmail(email: string) {
        return await Promise.allSettled([UserManager.addNewUserByEmail(email), ReviewManager.addNewReviewByEmail(email)]);
    }

    static async getLevelTest(): Promise<{ reviewArr: Review[], vocaArr: Voca[] }> {
        const vocaSet: Set<Voca> = new Set();
        for (let i = 1; i <= 10; i++) {
            (await VocaManager.getNewRandomVocaByLevel(i, 3)).forEach(voca => {
                vocaSet.add(voca);
            })
        }
        const vocaArr: Voca[] = Array.from(vocaSet);

        const reviewArr = vocaArr.map(voca => {
            return ReviewManager.createReviewByVocaId(voca._id)
        });

        return { reviewArr, vocaArr };
    }

    static async getReviewArrByUser(user: User, cnt: number = 1): Promise<Review[]> {
        const reviewArr = await ReviewManager.getAllReviewByEmail(user.email);
        const nowReviewArr = reviewArr.filter(review => ((review.reviewDate)) < new Date().getTime());

        if (nowReviewArr.length >= cnt) {
            return nowReviewArr;
        } else {
            const vocaIdArr = reviewArr.map((review) => review.vocaId);
            const newVocaArr = await VocaManager.getNewRandomVocaByLevel(user.level, cnt - nowReviewArr.length, vocaIdArr);
            const newReviewArr = newVocaArr.map(voca => {
                return ReviewManager.createReviewByVocaId(voca._id)
            });

            return [...nowReviewArr, ...newReviewArr];
        }
    }

    static async getVocaArrByReviewArr(reviewArr: Review[]): Promise<Voca[]> {
        const vocaIdArr = reviewArr.map((review) => review.vocaId);
        return await VocaManager.getVocaArrByVocaIdArr(vocaIdArr);
    }

    static async updateReviewByEmail(email: string, review: Review, result: boolean): Promise<Review> {
        const updateResult = await ReviewManager.updateReviewByEmail(email, review, result);
        await ReviewManager.sortReviewByEmail(email);
        return updateResult;
    }

    static async updateLevelsByEmail(email: string, review: Review, result: boolean) {
        const user = await UserManager.getUserByEmail(email);
        if (user == null) return false;

        const voca = await VocaManager.getVocaByVocaId(review.vocaId);
        if (voca == null) return false;

        const updatedReview = ReviewManager.adjustReviewByResult(review, result);
        const vocaCnt = voca.oxArr[0] + voca.oxArr[1];

        if (result) {
            if (updatedReview.reviewCnt >= 4) {
                if (user.level < voca.level) {
                    user.level = this.getUpdatedLevel(user.level, voca.level, user.cnt);
                }
                voca.oxArr[0] += 1;
                voca.oxArr[1] -= 1;
                user.cnt += 1;
            } else if (review.reviewCnt === -1) {
                if (user.level < voca.level) {
                    user.level = this.getUpdatedLevel(user.level, voca.level, user.cnt);
                }
                voca.level = this.getUpdatedLevel(voca.level, user.level, vocaCnt);
                voca.oxArr[0] += 1;
                user.cnt += 1;
            }
        } else {
            if (updatedReview.reviewCnt >= 4) {
                if (user.level > voca.level) {
                    user.level = this.getUpdatedLevel(user.level, voca.level, user.cnt);
                }
                voca.oxArr[0] -= 1;
                voca.oxArr[1] += 1;
                user.cnt -= 1;
            } else if (review.reviewCnt === -1) {
                if (user.level > voca.level) {
                    user.level = this.getUpdatedLevel(user.level, voca.level, user.cnt);
                }
                voca.level = this.getUpdatedLevel(voca.level, user.level, vocaCnt);
                voca.oxArr[1] += 1;
            }
        }

        await Promise.allSettled([UserManager.updateUser(user), VocaManager.updateVoca(voca)]);

        return true;
    }

    static getUpdatedLevel(level: number, newLevel: number, cnt: number) {
        return (level * cnt + newLevel) / (cnt + 1)
    }

    static async updateReviewArrByEmail(email: string, reviewArr: Review[], resultMap: ResultMap) {
        // The below functions should be executed sequentially
        await ReviewManager.updateReviewArrByEmail(email, reviewArr, resultMap);
        await ReviewManager.sortReviewByEmail(email);
    }

}