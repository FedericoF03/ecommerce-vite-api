import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const TokenSchema = new Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  acces_token: {
    code: { type: String, unique: true }
  },
  refresh_token: {
    code: { type: String, unique: true },
    date: Date,
  },
});
