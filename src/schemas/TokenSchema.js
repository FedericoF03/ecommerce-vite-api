import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const TokenSchema = new Schema({
  id: { type: String, unique: true, default: () => uuidv4() },
  id_DB: { type: String, unique: true, default: null },
  id_MELI: { type: Number, unique: true, default: null },
  acces_token: { code: String, date: Date },
  refresh_tokens: {
    tokens: [{ code: String, date: Date, ip: String }],
  },
});
