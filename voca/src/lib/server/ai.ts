import OpenAI from "openai";
import { OPENAI_API_KEY } from '$env/static/private';

class AI {

    #openai;

    constructor() {
        if (OPENAI_API_KEY === undefined) {
            throw new Error('Please set OPENAI_API_KEY at .env file!');
        } else {
            this.#openai = new OpenAI({
                apiKey: OPENAI_API_KEY
            });
        }
    }

    async generateExampleAndTranslation(word: string, meaning: string): Promise<[number, string, string, string]> {
        const completion = await this.#openai.chat.completions.create({
            model: "ft:gpt-4o-2024-08-06:personal:voca:AxcRV5gb",
            // model: "ft:gpt-4o-mini-2024-07-18:personal:voca:AxbxnT8V",
            // model: "gpt-4o-mini",
            // model: "ft:gpt-4o-mini-2024-07-18:personal:voca:AxUSc6oT",
            // model: "ft:gpt-4o-mini-2024-07-18:personal:voca:AsO7VJmH",
            messages: [
                { role: "developer", content:"Given English word and Korean meaning, provide the following fields in a JSON dict, where applicable: \"level\" (Level of the word from 1 to 10), \"example\" (Natural English example sentence of the word), \"translation\" (Korean translation of the example), \"pronunciation\" (The pronunciation of the word in Hangul). Highlighting the word and meaning in the example and translation respectively with *. If the word and meaning are not matched, awkward, or wrong, provide an empty JSON dict."},
                {
                    role: "user", content: `word: ${word}, meaning: ${meaning}`,
                },
            ],
        });

        console.log(completion.choices[0].message.content);

        const response = JSON.parse(completion.choices[0].message.content||'{}');
        const level = Number(response['level']);
        if (Object.keys(response).length === 0) {
            throw new Error('The word and meaning are not matched or wrong.');
        } else {
            if (!response['example'].includes('*') || !response['translation'].includes('*')) {
                throw new Error('The AI generated wrong example, please do it again!');
            } else if (level < 1 || level > 10) {
                throw new Error('The AI generated wrong level, please do it again!');
            } else {
                return [level, response['example'], response['translation'], response['pronunciation']];
            }
        }
    }
}

const ai = new AI();
export default ai;