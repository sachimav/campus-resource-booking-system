import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);