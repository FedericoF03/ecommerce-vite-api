import { model } from "mongoose";
import { FavoriteSchema as F } from "../schemas/FavoriteSchema.js";

const Favorite = model("Favorite", F);

export default class FavoriteModel {
  constructor (obj, filter) {
    this.obj = obj
    this.filter = filter
  }
  async createFavorite() {
    const newUser = await Favorite.create(this.obj);
    return newUser
  }

  async findFavorite() {
    const newUser = await Favorite.findOne(this.obj);
    return newUser
  }

  async deleteFavorite() {
    const newUser = await Favorite.findOneAndRemove(this.filter, this.obj);
    return newUser
  }

}
