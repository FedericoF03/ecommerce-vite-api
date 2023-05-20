import TokenModel from "../models/TokenModel.js";
import { v4 as uuidv4 } from 'uuid';

export default class TokenController {
  controllerCreateToken = async (obj) => {
    const TokenModelCreate = new TokenModel({id: uuidv4(), ...obj});
    const res = await TokenModelCreate.createToken();
    return res;
  };

  controllerFindToken = async (obj) => {
    const TokenModelFind = new TokenModel(obj);
    const res = await TokenModelFind.findToken();
    return res;
  };

  controllerDeleteToken = async (filter, obj) => {
    const TokenModelFind = new TokenModel(obj, filter);
    const res = await TokenModelFind.deleteToken();
    return res;
  };

  controllerUpdateToken = async (filter, obj, options) => {
    const TokenModelFind = new TokenModel(obj, filter, options);
    const res = await TokenModelFind.updateToken();
    return res;
  };
}
