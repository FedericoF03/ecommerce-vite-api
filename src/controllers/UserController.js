import UserModel from "../models/UserModel.js";

export default class UserController {

  controllerCreateUser = async (obj) => {
    const userModelCreate = await new UserModel(obj)
    const res = await userModelCreate.CreateUser()
    console.log(res)
  }
}