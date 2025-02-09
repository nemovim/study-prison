import GeneralManager from '$lib/server/generalManager.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const { review, result } = await request.json();
    const updateResult = await GeneralManager.updateReviewByEmail(locals.user.email, review, result)
    await GeneralManager.updateLevelsByEmail(locals.user.email, review, result);
    return json(updateResult);
}