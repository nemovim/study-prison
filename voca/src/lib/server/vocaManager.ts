import VocaModel from '$lib/models/voca';
import ai from '$lib/server/ai';
import { readFile } from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';

export default class VocaManager {
    static async addVocaByWordAndMeaning(_word: string, meaning: string, overwrite: boolean = false) {
        const word = _word.replaceAll(/ +/g, ' ').replaceAll(/-+/g, '-');
        const wordReg = new RegExp(`${word}\|${word.replaceAll('-', ' ')}\|${word.replaceAll(' ', '-')}`, 'i');
        const vocaArr: Voca[] = await VocaModel.find({ word: wordReg, meaning });
        if (vocaArr.length === 0 || overwrite) {
            const [level, example, translation, pronunciation] = await ai.generateExampleAndTranslation(word, meaning);
            if (vocaArr.length === 0) {
                return await this.addVoca(word, level, meaning, example, translation, pronunciation);
            } else {
                const voca = await this.getVocaByWordAndMeaning(word, meaning);
                voca.example = example;
                voca.translation = translation;
                voca.pronunciation = pronunciation;
                await this.updateVoca(voca);
                return voca;
            }
        } else {
            throw new Error('이미 존재하는 단어-뜻 조합입니다.');
        }
    }

    static async addVoca(word: string, level: number, meaning: string, example: string, translation: string, pronunciation: string): Promise<Voca> {
        const voca = new VocaModel({
            word,
            meaning,
            example,
            translation,
            pronunciation,
            level,
        });
        return await voca.save();
    }

    static async getVocaArrByVocaIdArr(vocaIdArr: string[]): Promise<Voca[]> {
        return await VocaModel.find({ _id: { $in: vocaIdArr } });
    }

    static async getVocaByWordAndMeaning(word: string, meaning: string) {
        return (await VocaModel.find({ word, meaning }))[0];
    }

    static async getVocaByVocaId(vocaId: string): Promise<Voca | null> {
        return await VocaModel.findOne({ _id: vocaId });
    }

    static async updateVoca(voca: Voca) {
        return await VocaModel.updateOne({ _id: voca._id }, voca);
    }

    static async getNewRandomVocaByLevel(level: number, cnt: number = 1, vocaIdArr: string[] = []): Promise<Voca[]> {
        let vocaArr: Voca[] = await VocaModel.aggregate().match({
            $and: [{ level: { $lte: level + 1.5 } }, { level: { $gte: level - 1 } }], '_id': { $not: { $in: vocaIdArr } }
        }).sample(cnt);
        // const vocaArr: Voca[] = await VocaModel.aggregate().match({'level': {'$and': [{'$gt': level}, {'$lt': level}]}}).sample(cnt);
        if (vocaArr.length === 0) {
            vocaArr = await VocaModel.aggregate().match({
                $and: [{ level: { $lte: level + 2.5 } }, { level: { $gte: level - 2 } }], '_id': { $not: { $in: vocaIdArr } }
            }).sample(cnt);
        }

        return vocaArr;
    }

    static async getVocaFromFile() {
        const data = JSON.parse(String(await readFile('./src/lib/server/voca.jsonl')));

        const actionArr: Promise<any>[] = [];
        data.forEach((line: any) => {

            const input = line['messages'][1]['content']
            const word = input.split(',')[0].split(':')[1].trim();
            const meaning = input.split(',')[1].split(':')[1].trim();

            const output = JSON.parse(line['messages'][2]['content']);
            const level = output['level'];
            const example = output['example'];
            const translation = output['translation'];
            const pronunciation = output['pronunciation'];

            actionArr.push(this.addVoca(word, level, meaning, example, translation, pronunciation));
        });
        console.time('add');
        const result = await Promise.allSettled(actionArr);
        console.timeEnd('add')

    }
}