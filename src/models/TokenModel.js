import { model } from "mongoose";
import { TokenSchema } from "../schemas/TokenSchema.js";

const Token = model("Token", TokenSchema);

export default class TokenModel {
  constructor(obj, filter, options) {
    this.obj = obj;
    this.filter = filter;
    this.options = options;
  }
  async createToken() {
    const newToken = await Token.create(this.obj);
    return newToken;
  }

  async findToken() {
    const newToken = await Token.findOne(this.obj).select({"refresh_tokens.tokens": 1, "acces_token": 1, id_MELI: 1, id_DB:1});
    return newToken;
  }

  async deleteToken() {
    const newToken = await Token.findOneAndRemove(this.filter, this.obj);
    return newToken;
  }

  async updateToken() {
    const newToken = await Token.findOneAndUpdate(
      this.filter,
      this.obj,
      this.options
    );
    return newToken;
  }
}
