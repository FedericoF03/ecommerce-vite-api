import { model } from "mongoose";
import { UserSchema as U } from "../schemas/UserSchema.js";

const User = model("User", U);

export default class UserModel {
  constructor(obj, filter, options) {
    this.obj = obj;
    this.filter = filter;
    this.options = options
  }
  async CreateUser() {
    const newUser = await User.create(this.obj);
    return newUser
  }

  async FindUser() {
    const newUser = await User.findOne(this.obj).select({id:1})
    return newUser
  }

  async FindUserData() {
    const newUser = await User.findOne(this.obj).select({id: 0, id_MELI: 0, account: 0, email: 0})
    return newUser
  }

  async updateUser() {
    const newUser = await User.findOneAndUpdate(this.filter, this.obj, this.options);
    return newUser
  }
}
