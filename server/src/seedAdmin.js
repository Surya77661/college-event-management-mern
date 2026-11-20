import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const email = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
const exists = await User.findOne({ email });
if (exists) console.log("Admin account already exists:", email);
else {
  await User.create({
    name: process.env.ADMIN_NAME || "Campus Admin",
    phone: "0000000000", gender: "Prefer not to say", email,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 12),
    role: "admin"
  });
  console.log("Admin created:", email);
}
await mongoose.disconnect();
