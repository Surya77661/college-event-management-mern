import { Router } from "express";
import Registration from "../models/Registration.js";
import { protect, adminOnly, userOnly } from "../middleware/auth.js";
const router = Router();
router.get("/mine", protect, userOnly, async (req, res) => {
  const rows = await Registration.find({ user: req.user._id }).populate("event").sort({ createdAt: -1 });
  res.json(rows);
});
router.get("/", protect, adminOnly, async (_req, res) => {
  const rows = await Registration.find().populate("event").populate("user", "name email phone gender").sort({ createdAt: -1 });
  res.json(rows);
});
export default router;
