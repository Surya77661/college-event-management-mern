import { Router } from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { protect, adminOnly, userOnly } from "../middleware/auth.js";
const router = Router();

router.get("/", async (_req, res) => {
  const events = await Event.find().sort({ date: 1 });
  const counts = await Registration.aggregate([{ $group: { _id: "$event", count: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map(x => [String(x._id), x.count]));
  res.json(events.map(e => ({ ...e.toObject(), registeredCount: map[String(e._id)] || 0 })));
});
router.post("/", protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Event.create({ ...req.body, createdBy: req.user._id })); }
  catch { res.status(400).json({ message: "Please provide valid event details." }); }
});
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch { res.status(400).json({ message: "Could not update event." }); }
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  await Registration.deleteMany({ event: event._id });
  res.json({ message: "Event deleted." });
});
router.post("/:id/register", protect, userOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    const count = await Registration.countDocuments({ event: event._id });
    if (count >= event.capacity) return res.status(400).json({ message: "This event is full." });
    await Registration.create({ event: event._id, user: req.user._id });
    res.status(201).json({ message: "You are registered for this event." });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "You have already registered for this event." });
    res.status(500).json({ message: "Registration failed." });
  }
});
export default router;
