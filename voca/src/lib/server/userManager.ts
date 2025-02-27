import UserModel from '$lib/models/user';
import ai from '$lib/server/ai';

export default class UserManager {

    static async addNewUserByEmail(email: string) {
        const user = new UserModel({
            email,
        });
        return await user.save();
    }

    static async getUserByEmail(email: String): Promise<User | null> {
        return await UserModel.findOne({ email });
    }

    static async updateUser(user: User) {
        return await UserModel.updateOne({ email: user.email }, user);
    }

    static async updateUserHistory(user: User) {
        return await UserModel.updateOne({ email: user.email }, {
            $push: { historyArr: {
                level: user.level,
                cnt: user.cnt,
                date: new Date(),
            }}
        });
    }
}