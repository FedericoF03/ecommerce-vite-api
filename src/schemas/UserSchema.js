import { Schema } from "mongoose";

export const UserSchema = new Schema({
  refresh_token: { type: String, default: null },
  acces_token: { type: String, default: null },
  id_DB: { type: String, required: true, unique: true },
  id_ML: { type: Number, default: null, unique: true },
  password: { type: String },
  Auth_ML: { type: Boolean, default: false },
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
  email: { type: String, required: true },
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
