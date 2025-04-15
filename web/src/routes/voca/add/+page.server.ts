import GeneralManager from '$lib/server/generalManager';
import type { Actions } from './$types';

export async function load({ parent }) {
    // VocaManager.getVocaFromFile();
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const word: string = String(formData.get('word'));
        const meaning: string = String(formData.get('meaning'));
        const overwrite: boolean = !!formData.get('overwrite');
        try {
            const voca = await GeneralManager.addVocaByWordAndMeaning(word, meaning, overwrite);
            return { success: true, voca: JSON.stringify(voca) };
        } catch (e) {
            if (e instanceof Error) {
                return { success: false, error: e.message };
            } else {
                return { success: false, error: String(e) };
            }
        }
    }
} satisfies Actions;