import { model } from "mongoose";
import { UserSchema } from "../schemas/UserSchema.js";

const User = model("User", UserSchema);

export default class UserModel {
  constructor(obj) {
    this.obj = obj;
  }
  async CreateUser() {
    const newUser = await User.create(this.obj);
    return newUser
  }

  async FindUserML() {
    const newUser = await User.findOne({
      id_ML: this.obj.id
    });
    return newUser
  }
}
