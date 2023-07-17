import { model } from "mongoose";
import { BoughtSchema } from "../schemas/BoughtSchema.js";

const Bought = model("Bought", BoughtSchema);

export default class BoughtModel {
  constructor (obj, filter, options) {
    this.obj = obj
    this.filter = filter
    this.options = options
  }
  async createBought() {
    const newBought = await Bought.create(this.obj)
    return newBought
  }

  async findBought() {
    const newBought = await Bought.findOne(this.obj).select({orders:1, _id: 0});
    return newBought
  }

  async deleteBought() {
    const newBought = await Bought.findOneAndRemove(this.filter, this.obj).select({orders:1, _id: 0});
    return newBought
  }

  async updateBought() {
    const newBought = await Bought.findOneAndUpdate(this.filter, this.obj, this.options).select({orders:1, _id: 0});
    return newBought
  }
}
