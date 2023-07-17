import FavoriteModel from "../models/FavoriteModel.js";

export default class FavoriteController {
  controllerCreateFavorite = async (obj) => {
    const userModelCreate = new FavoriteModel(obj);
    const res = await userModelCreate.createFavorite();
    return res;
  };

  controllerFindFavorite = async (obj) => {
    const userModelFind = new FavoriteModel(obj);
    const res = await userModelFind.findFavorite();
    return res;
  };

  controllerDeleteFavorite = async (obj) => {
    const userModelFind = new FavoriteModel(obj);
    const res = await userModelFind.deleteFavorite();
    return res;
  };

  controllerUpdateFavorite = async (filter, obj, options) => {
    const userModelFavorite = new FavoriteModel(obj, filter, options);
    const res = await userModelFavorite.updateFavorite();
    return res;
  };
}
