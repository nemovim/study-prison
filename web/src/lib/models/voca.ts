import mongoose from 'mongoose';

const schema = new mongoose.Schema<Voca>(
    {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
        level: { type: Number, required: true },
        example: { type: String, required: true },
        translation: { type: String, required: true },
        pronunciation: { type: String, default: '' },
        acceptedWords: { type: [String], default: [] },
        oxArr: { type: [Number], default: [0, 0] }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Voca', schema);