import UserModel from "../models/UserModel.js";

export default class UserController {

  controllerCreateUser = async (obj) => {
    const userModelCreate = new UserModel(obj)
    const res = await userModelCreate.CreateUser()
    return res
  }

  controllerFindUser = async (obj) => {
    const userModelFind = new UserModel(obj)
    const res = await userModelFind.FindUser()
    return res
  }

  controllerUpdateUser = async (obj, filter) => {
    const userModelFind = new UserModel(obj,filter)
    const res = await userModelFind.updateUser()
    return res
  }
}