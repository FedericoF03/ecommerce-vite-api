import { model } from "mongoose";
import { BoughtSchema } from "../schemas/BoughtSchema.js";

const Bought = model("Bought", BoughtSchema);

export default class BoughtModel {
  constructor (obj, filter) {
    this.obj = obj
    this.filter = filter
  }
  async createBought() {
    const newBought = await Bought.create(this.obj);
    return newBought
  }

  async findBought() {
    const newBought = await Bought.findOne(this.obj);
    return newBought
  }

  async deleteBought() {
    const newBought = await Bought.findOneAndRemove(this.filter, this.obj);
    return newBought
  }

  async updateBought() {
    const newBought = await Bought.findOneAndUpdate(this.filter, this.obj, this.options);
    return newBought
  }
}
