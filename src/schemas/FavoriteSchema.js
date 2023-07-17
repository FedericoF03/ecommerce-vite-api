import { Schema } from "mongoose";

export const FavoriteSchema = new Schema({
  id: { type: String, required: true, unique: true },
  id_DB: { type: String, unique: true },
  items: [
    {
      item_id: String,
      bookmarked_date: Date,
    },
  ],
});
