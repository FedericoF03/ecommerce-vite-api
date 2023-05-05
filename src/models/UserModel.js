import { model } from "mongoose";
import { UserSchema } from "../schemas/Schema.js";

const User = model("User", UserSchema);

export default class UserModel {
  constructor(obj) {
    this.obj = obj
  }
  async CreateUser () {
    const newUser = await User.create(this.obj);
    console.log(newUser)
  }
}
