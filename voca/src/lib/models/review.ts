import mongoose from 'mongoose';

interface ReviewSchema {
    email: string,
    reviewArr: Review[]
}

const schema = new mongoose.Schema<ReviewSchema>(
    {
        email: { type: String, required: true, unique: true},
        reviewArr: { type: [{
            // vocaId: { type: mongoose.Types.ObjectId, required: true},
            // reviewCnt: { type: Number, required: true }, 
            // reviewTime: { type: Date, required: true},
            vocaId: mongoose.Types.ObjectId,
            reviewCnt: Number,
            reviewDate: Date,
        }], default: [], _id: false},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Review', schema);