import GeneralManager from '$lib/server/generalManager.js';

export async function load({ locals }) {
    const reviewArr = await GeneralManager.getAllReviewsByEmail(locals.user.email);
    return {
        reviewArr: JSON.stringify(reviewArr),
    }
}