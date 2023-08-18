import connectToDB from "@/lib/connectToDB";
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import User from "@/lib/models/mongoose/User";
import { generateFromString } from "generate-avatar";
const bcrypt = require("bcrypt");
const saltRounds = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req", req.method);
  if (req.method !== "POST") {
    return res.status(400).json({ message: "Only POST requests allowed" });
  }
  if (mongoose.connection.readyState === 0) await connectToDB();
  console.log("req.body", req.body);
  const { name, email, password, role } = req.body;
  const acceptedRoles = ["user", "seller", "admin"];

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!acceptedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    console.log("user", user);
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const image = generateFromString(email);
  // Create user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: role,
    image,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    await newUser.save();
    console.log("env", process.env.NEXTAUTH_URL);
    return res.status(200).json({ message: "User created" });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
}
