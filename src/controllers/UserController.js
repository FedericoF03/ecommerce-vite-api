import UserModel from "../models/UserModel.js";

export default class UserController {

  controllerCreateUser = async (obj) => {
    const userModelCreate = new UserModel(obj)
    const res = await userModelCreate.CreateUser()
    return res
  }

  controllerFindUserML = async (obj) => {
    const userModelFind = new UserModel(obj)
    const res = await userModelFind.FindUserML()
    return res
  }
}