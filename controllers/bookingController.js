import Booking from "../models/booking.js";
import Resource from "../models/resource.js";

export const createBooking = async (req, res) => {
    try {
        const { resourceId, date, startTime, endTime } = req.body;

        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        const conflict = await Booking.findOne({
            resourceId,
            date,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: "Resource already booked for this time" });
        }

        const booking = await Booking.create(req.body);
        res.status(201).json(booking);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("resourceId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};