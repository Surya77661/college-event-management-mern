import { Router } from "express";
import Announcement from "../models/Announcement.js";
import { protect, adminOnly } from "../middleware/auth.js";
const router = Router();
router.get("/", async (_req, res) => res.json(await Announcement.find().sort({ createdAt: -1 })));
router.post("/", protect, adminOnly, async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ message: "Title and message are required." });
  res.status(201).json(await Announcement.create({ title, message, createdBy: req.user._id }));
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Announcement removed." });
});
export default router;
