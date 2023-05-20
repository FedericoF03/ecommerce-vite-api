import UserModel from "../models/UserModel.js";

export default class UserController {
  controllerCreateUser = async (obj) => {
    const userModelCreate = new UserModel(obj);
    const res = await userModelCreate.CreateUser();
    return res;
  };

  controllerFindUser = async (obj) => {
    const userModelFind = new UserModel(obj);
    const res = await userModelFind.FindUser();
    return res;
  };

  controllerFindUserData = async (obj) => {
    const userModelFind = new UserModel(obj);
    const res = await userModelFind.FindUserData();
    return res;
  };

  controllerUpdateUser = async (filter, obj, options) => {
    const userModelFind = new UserModel(obj, filter, options);
    const res = await userModelFind.updateUser();
    return res;
  };
}
