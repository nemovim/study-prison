import mongoose from 'mongoose';

const schema = new mongoose.Schema<User>(
    {
        email: { type: String, required: true, unique: true},
        level: { type: Number, required: true, default: 1 },
        cnt: { type: Number, requierd: true, default: 0 },
        historyArr: { type: [{ level: Number, cnt: Number, date: Date}], defualt: [{
            level: 1,
            cnt: 0,
            date: new Date()
        }]},
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', schema);