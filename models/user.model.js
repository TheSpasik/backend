import { Schema, model } from "mongoose";

const UserModel = model(
  "Users",
  new Schema({
    _id: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    subscription: { type: String, required: true },
  })
);

export default UserModel;
