import connectToDB from "@/lib/connectToDB";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Item from "@/lib/models/Item";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const params = req.query;
    let queryPageSize = params.pageSize
      ? parseInt(params.pageSize as string)
      : 10;
    let queryPageIndex = params.pageIndex
      ? parseInt(params.pageIndex as string)
      : 0;

    const category = params.category ? (params.category as string) : null;
    const { _id, ownerId } = params;

    if (ownerId) {
      if (mongoose.connection.readyState === 0) await connectToDB();
      const items = await Item.find({
        ownerId: new mongoose.Types.ObjectId(ownerId),
      });
      return res.status(200).json(items);
    }

    if (_id) {
      if (mongoose.connection.readyState === 0) await connectToDB();
      const item = await Item.findOne({ _id });
      return res.status(200).json(item);
    }

    if (queryPageSize > 50) queryPageSize = 50;

    const query = {};
    if (category) {
      query["category"] = category;
    }
    if (mongoose.connection.readyState === 0) await connectToDB();
    const items = await Item.find(query)
      .limit(queryPageSize)
      .skip(queryPageIndex);
    return res.status(200).json(items);
  } else if (req.method === "POST") {
    if (mongoose.connection.readyState === 0) await connectToDB();
    console.log("req.body", req.body);
    const newItem = new Item({
      ...req.body,
      _id: new mongoose.Types.ObjectId(req.body._id),
      price: parseFloat(req.body.price),
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: new mongoose.Types.ObjectId(req.body.ownerId),
    });
    try {
      console.log("newItem", newItem);
      await newItem.save();
      return res.status(200).json({ message: "Item created" });
    } catch (error) {
      console.log("error", error);
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
}
