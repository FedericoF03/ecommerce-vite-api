import { model } from "mongoose";
import { UserSchema } from "../schemas/UserSchema.js";

const User = model("User", UserSchema);

export default class UserModel {
  constructor(obj, filter) {
    this.obj = obj;
    this.filter = filter
  }
  async CreateUser() {
    const newUser = await User.create(this.obj);
    return newUser
  }

  async FindUser() {
    const newUser = await User.findOne(this.obj);
    return newUser
  }

  async updateUser() {
    const newUser = await User.findOneAndUpdate(this.filter, this.obj);
    return newUser
  }
}
