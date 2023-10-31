import { Schema, models, model } from "mongoose";
import { Categories } from "../Constants";

const ItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: 0.01,
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: Categories,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  images: {
    type: [String],
    required: [true, "Please provide images"],
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an owner"],
  },
  stock: {
    type: Number,
    required: [true, "Please provide a stock"],
    min: 0,
  },
  __v: Number,
});

export default models.Item || model("Item", ItemSchema);
