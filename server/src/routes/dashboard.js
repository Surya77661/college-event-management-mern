import { Router } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import Announcement from "../models/Announcement.js";
import { protect, adminOnly } from "../middleware/auth.js";
const router = Router();
router.get("/stats", protect, adminOnly, async (_req, res) => {
  const [events, users, registrations, announcements] = await Promise.all([
    Event.countDocuments(), User.countDocuments({ role: "user" }),
    Registration.countDocuments(), Announcement.countDocuments()
  ]);
  res.json({ events, users, registrations, announcements });
});
export default router;
