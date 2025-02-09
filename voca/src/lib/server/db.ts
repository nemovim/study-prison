import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private'

export default class DB {
    constructor() {
        if (MONGO_URI === undefined) {
            throw new Error('Please set MONGO_URI at .env file!');
        }
    }

    async init() {
        await mongoose.connect(MONGO_URI);
    }

}