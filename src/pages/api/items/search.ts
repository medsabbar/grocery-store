import connectToDB from "@/lib/connectToDB";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Item from "@/lib/models/Item";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("here");
    try {
      console.log("req.query", req.query);
      const params = req.query;
      const search = params.search ? (params.search as string) : null;
      if (!search)
        return res.status(400).json({ message: "Missing search query" });
      let queryPageSize = params.pageSize
        ? parseInt(params.pageSize as string)
        : 10;
      let queryPageIndex = params.pageIndex
        ? parseInt(params.pageIndex as string)
        : 0;

      if (queryPageSize > 50) queryPageSize = 50;
      const query = {
        $text: {
          $search: search,
        },
      };
      console.log("query", query);
      if (mongoose.connection.readyState === 0) await connectToDB();
      const items = await Item.find(query)
        .limit(queryPageSize)
        .skip(queryPageIndex * queryPageSize);
      return res.status(200).json(items);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Only GET requests allowed" });
  }
}
