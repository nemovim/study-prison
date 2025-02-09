import ReviewModel from '$lib/models/review';

export default class ReviewManager {

    static async addNewReviewByEmail(email: string) {
        const review = new ReviewModel({ email });
        return await review.save();
    }

    // static async getReviewToReviewByEmail(email: string, cnt: number = 20): Promise<Review[]> {

    //     const userVocaArr: Review[] = (await ReviewModel.aggregate().match({ email }).sort({ 'vocaArr.reviewDate': 1 }).project({ 'vocaArr': { '$slice': ['$vocaArr', cnt] } }))[0]?.result;

    //     return userVocaArr;
    // }

    static async getAllReviewByEmail(email: string): Promise<Review[]> {
        const data = await ReviewModel.findOne({ email }).sort({ 'vocaArr.reviewDate': 1 });
        if (data == null) {
            return [];
        } else {
            return data.reviewArr;
        }

    }

    static createReviewByVocaId(vocaId: string) {
        const review: Review = {
            vocaId,
            reviewCnt: -1,
            reviewDate: -1,
        };
        return review;
    }

    static async updateReviewArrByEmail(email: string, reviewArr: Review[], resultMap: ResultMap) {
        return await Promise.allSettled(reviewArr.map((review) => this.updateReviewByEmail(email, review, !!resultMap.get(review.vocaId))));
    }

    static reviewDeltaMap = new Map<number, number>([
        [0, 0],
        [1, 1000 * 3600 * 12],
        [2, 1000 * 3600 * 24 * 2],
        [3, 1000 * 3600 * 24 * 7],
        [4, 1000 * 3600 * 24 * 30],
        [5, 1000 * 3600 * 24 * 60],
        [6, 1000 * 3600 * 24 * 180],
        [7, 1000 * 3600 * 24 * 365],
    ])

    static adjustReviewByResult(_review: Review, result: boolean) {
        const review = {..._review}
        if (result) {
            if (review.reviewCnt === -1) {
                review.reviewCnt = 4
            } else {
                review.reviewCnt += 1;
            }
        } else {
            review.reviewCnt = 0;
            // if (review.reviewCnt == 0) {
            // } else {
            //     review.reviewCnt = 1;
            // }
        }

        review.reviewDate = new Date().getTime() + (this.reviewDeltaMap.get(review.reviewCnt) || 0);

        return review;
    }

    static async updateReviewByEmail(email: string, review: Review, result: boolean): Promise<Review> {
        const updatedReview = this.adjustReviewByResult(review, result);

        if (review.reviewCnt === -1) {
            // New voca
            await ReviewModel.updateOne({ email }, {
                $push: {
                    reviewArr: updatedReview
                }
            });
        } else {
            // Update voca
            await ReviewModel.updateOne({ email, 'reviewArr.vocaId': review.vocaId }, { 'reviewArr.$': updatedReview });
        }

        return updatedReview;
    }

    static async sortReviewByEmail(email: string) {
        await ReviewModel.updateOne({ email }, {
            $push: { reviewArr: { $each: [], $sort: { 'reviewDate': 1 } } }
        });
    }
}