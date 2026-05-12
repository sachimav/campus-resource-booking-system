import express from "express";
import {
    createBooking,
    getBookings,
    deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);

export default router;