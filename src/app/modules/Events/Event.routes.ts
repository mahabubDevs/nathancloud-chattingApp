import express from "express";
import { EventController } from "./Event.controller";
import { fileUploader } from "../../../helpars/fileUploader";
// import { authenticate } from "../"; // ✅ Auth middleware
import auth from "../../middlewares/auth";

const router = express.Router();

// ✅ Apply authentication middleware
router.post("/", auth(), fileUploader.uploadSingle, EventController.createEvent);
router.get("/", auth(), EventController.getEvents);
router.delete("/:eventId", auth(), EventController.deleteEvent);
router.put("/:eventId", auth(), fileUploader.uploadSingle, EventController.updateEvent);

export const EventRoutes = router;
