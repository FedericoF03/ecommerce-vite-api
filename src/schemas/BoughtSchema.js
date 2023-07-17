import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const BoughtSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  id_DB: { type: String, unique: true },
  id_MELI: { type: Number, default: null },
  orders: [
    {
      items: [
        {
          item_id: String,
          quantity: Number,
          bookmarked_date: Date,
        },
      ],
      quantityTotal: Number,
      bookmarked_date: Date,
      priceTotal: Number
    },
  ],
});
