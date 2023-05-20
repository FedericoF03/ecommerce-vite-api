import { Schema } from "mongoose";

export const CartSchema = new Schema({
  id: { type: String, required: true, unique: true },
  id_DB: { type: String },
  id_MELI: { type: String },
  items: [
    {
      item_id: String,
      quantity: Number,
      bookmarked_date: Date,
    },
  ],
});