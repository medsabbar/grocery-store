import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date,
  updatedAt: Date,
  image: String,
  __v: Number,
});

export default models.User || model("User", UserSchema);
