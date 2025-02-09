import mongoose from 'mongoose';

const schema = new mongoose.Schema<User>(
    {
        email: { type: String, required: true, unique: true},
        level: { type: Number, required: true, default: 0 },
        cnt: { type: Number, requierd: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', schema);