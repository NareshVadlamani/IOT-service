import { model, Schema, Types } from "mongoose";
import Mongo from "./mongo";
import User from "./user";

const hobby = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  passionLevel: { type: String, required: true },
  date: { type: String, required: true },
});

interface Ihobby {
  name: string;
  passionLevel: string;
  date: string;
}

export default class Hobby {
  HobbyClc: any;
  constructor() {
    this.HobbyClc = model("hobby", hobby);
  }
  async getHobbiesListByIds(userIds: string[]) {
    const mongooseIds = userIds.map((id) => Types.ObjectId(id));
    const users = await this.HobbyClc.find({
      _id: {
        $in: [...mongooseIds],
      },
    });
    if (users.length) return users as string;
    else throw new Error(`no.hobby.found.`);
  }

  async getAllHobbies() {
    const allHobbies = await this.HobbyClc.find({});
    return allHobbies;
  }

  async addHobby(userId: string, hobby: Ihobby) {
    const _id = Types.ObjectId();
    const userModel = new this.HobbyClc({ _id, ...hobby });
    const data = await userModel.save();
    Mongo.user.updateUserHobbies(userId, data._id);
  }
}
