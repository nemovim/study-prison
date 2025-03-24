import ReviewModel from '$lib/models/review';
import { reviewDeltaSecMap } from '$lib/utils/utils';

export default class ReviewManager {

    static async addNewReviewByEmail(email: string) {
        const review = new ReviewModel({ email });
        return await review.save();
    }

    static async getAllReviewsByEmail(email: string): Promise<Review[]> {
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
            reviewDate: new Date(0),
        };
        return review;
    }

    static async updateReviewArrByEmail(email: string, reviewArr: Review[], resultMap: ResultMap) {
        return await Promise.allSettled(reviewArr.map((review) => this.updateReviewByEmail(email, review, !!resultMap.get(review.vocaId))));
    }

    static adjustReviewByResult(_review: Review, result: boolean) {
        const review = {..._review}
        if (result) {
            if (review.reviewCnt === -1) {
                review.reviewCnt = 5
            } else {
                review.reviewCnt += 1;
            }
        } else {
            review.reviewCnt = 0;
        }

        review.reviewDate = new Date(new Date().getTime() + 1000*(reviewDeltaSecMap.get(review.reviewCnt) || 0));

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