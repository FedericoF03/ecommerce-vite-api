import { model } from "mongoose";
import { CartSchema } from "../schemas/CartSchema.js";

const Cart = model("Cart", CartSchema);

export default class CartModel {
  constructor (obj, filter) {
    this.obj = obj
    this.filter = filter
  }
  async createCart() {
    const newCart = await Cart.create(this.obj);
    return newCart
  }

  async findCart() {
    const newCart = await Cart.findOne(this.obj);
    return newCart
  }

  async deleteCart() {
    const newCart = await Cart.findOneAndRemove(this.filter, this.obj);
    return newCart
  }

  async updateCart() {
    const newCart = await Cart.findOneAndUpdate(this.filter, this.obj, this.options);
    return newCart
  }
}
