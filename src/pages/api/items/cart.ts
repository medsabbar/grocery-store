import connectToDB from "@/lib/connectToDB";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Item from "@/lib/models/Item";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ids } = req.body;
    console.log("ids", ids);
    if (!ids || ids.length === 0)
      return res.status(400).json({ message: "Missing ids" });
    try {
      const query = {
        _id: {
          $in: ids.map((id: string) => new mongoose.Types.ObjectId(id)),
        },
      };
      const items = await Item.find(query);
      return res.status(200).json(items);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Only POST requests allowed" });
  }
}
