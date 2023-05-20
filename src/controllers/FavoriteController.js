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

  controllerDeleteFavorite = async (filter, obj) => {
    const userModelFind = new FavoriteModel(obj, filter);
    const res = await userModelFind.deleteFavorite();
    return res;
  };
}
