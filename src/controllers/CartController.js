import CartModel from "../models/CartModel.js";

export default class CartController {
  controllerCreateCart = async (obj) => {
    const CartModelCreate = new CartModel(obj);
    const res = await CartModelCreate.createCart();
    return res;
  };

  controllerFindCart = async (obj) => {
    const CartModelFind = new CartModel(obj);
    const res = await CartModelFind.findCart();
    return res;
  };

  controllerDeleteCart = async (filter, obj) => {
    const CartModelFind = new CartModel(obj, filter);
    const res = await CartModelFind.deleteCart();
    return res;
  };

  controllerUpdateCart = async (filter, obj, options) => {
    const CartModelFind = new CartModel(obj, filter, options);
    const res = await CartModelFind.updateCart();
    return res;
  };
}
