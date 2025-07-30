import express from "express";
import { cancelRegistration, createEvent, getEvents, getEventStats, registerForEvent } from "../controllers/event.controller.js";
const router = express.Router();

router.post("/create-event", createEvent);

router.get("/get-events/:eventId", getEvents);

router.post("/register/:eventId", registerForEvent);

router.delete("/cancel/:eventId",cancelRegistration);

router.get("/stats/:eventId", getEventStats);

export default router;
