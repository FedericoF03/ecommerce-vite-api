import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const UserSchema = new Schema({
  account: {
    code: { type: String, default: null },
    status: { type: Boolean, default: false },
  },
  id: { type: String, unique: true, default: () => uuidv4() },
  id_MELI: { type: Number, default: null },
  password: { type: String, required: true },
  phone: { number: { type: Number, default: null } },
  address_line: { type: String, default: null },
  floor: { type: Number, default: null },
  apartment: { type: String, default: null },
  street_number: { type: Number, default: null },
  street_name: { type: String, default: null },
  zip_code: { type: Number, default: null },
  city: {
    name: { type: String, default: null },
  },
  state: {
    name: { type: String, default: null },
  },
  country: {
    id: { type: String, default: null },
    name: { type: String, default: null },
  },
  neighborhood: {
    name: { type: String, default: null },
  },
  municipality: {
    name: { type: String, default: null },
  },
  nickname: { type: String, default: null },
  registration_date: { type: Date, default: Date.now, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, default: null },
  country_id: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  identification: {
    number: { type: Number, default: null },
    type: { type: String, default: null },
  },
  thumbnail: {
    picture_url: {
      type: String,
      default:
        "https://media.discordapp.net/attachments/902978810956365877/1103811991950331924/image_2023-05-04_193426032-removebg-preview.png?width=472&height=473",
    },
  },
});
