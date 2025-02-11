import GeneralManager from '$lib/server/generalManager.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const { review, result } = await request.json();

    if (locals.user != undefined) {
        const updateResult = await GeneralManager.updateReviewByEmail(locals.user.email, review, result)
        await GeneralManager.updateLevelsByEmail(locals.user.email, review, result);
        return json(updateResult);
    } else {
        error(401, 'Unauthorized');
    }
}