import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const CartSchema = new Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  id_DB: { type: String, unique: true },
  id_MELI: { type: Number, default: null },
  items: [
    {
      item_id: String,
      quantity: Number,
      bookmarked_date: Date,
    },
  ],
});