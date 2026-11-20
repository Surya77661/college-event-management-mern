import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = Router();
const makeToken = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, phone, gender, email, password } = req.body;
    if (!name || !phone || !gender || !email || !password)
      return res.status(400).json({ message: "Please complete every field." });
    if (!/^[^\s@]+@gmail\.com$/i.test(email))
      return res.status(400).json({ message: "Please use a valid Gmail address." });
    if (!/^[0-9+()\-\s]{7,20}$/.test(phone))
      return res.status(400).json({ message: "Enter a valid phone number." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "An account with this Gmail already exists." });
    const user = await User.create({
      name, phone, gender, email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12), role: "user"
    });
    res.status(201).json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: "Could not create account." }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !["user", "admin"].includes(role))
      return res.status(400).json({ message: "Email, password and login type are required." });
    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Incorrect email or password for this login." });
    res.json({ token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: "Login failed." }); }
});
export default router;
