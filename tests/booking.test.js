import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import app from "./app.js";
import Booking from "../models/booking.js";
import Resource from "../models/resource.js";

describe("Booking Routes - /api/bookings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /api/bookings", () => {
    const validBookingPayload = {
      userName: "Kamal Perera",
      resourceId: "6a01714644c1a8dc0ad8323e",
      date: "2026-05-20",
      startTime: "10:00",
      endTime: "12:00",
    };

    it("should return status 404 if the requested resource does not exist", async () => {
      jest.spyOn(Resource, "findById").mockResolvedValue(null);

      const response = await request(app)
        .post("/api/bookings")
        .send(validBookingPayload);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Resource not found" });
    });

    it("should return status 400 if there is an overlapping booking for the resource", async () => {
      const existingResource = {
        _id: validBookingPayload.resourceId,
        name: "Seminar Hall",
        capacity: 100,
        location: "Block C",
        status: "available",
      };

      const conflictingBooking = {
        _id: "6b01714644c1a8dc0ad89999",
        userName: "Nimal Silva",
        resourceId: validBookingPayload.resourceId,
        date: "2026-05-20",
        startTime: "11:00",
        endTime: "13:00",
      };

      jest.spyOn(Resource, "findById").mockResolvedValue(existingResource);
      const findOneSpy = jest
        .spyOn(Booking, "findOne")
        .mockResolvedValue(conflictingBooking);

      const response = await request(app)
        .post("/api/bookings")
        .send(validBookingPayload);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Resource already booked for this time",
      });

      expect(findOneSpy).toHaveBeenCalledWith({
        resourceId: validBookingPayload.resourceId,
        date: validBookingPayload.date,
        $or: [{ startTime: { $lt: "12:00" }, endTime: { $gt: "10:00" } }],
      });
    });

    it("should successfully create a new booking and return status 201 when there is no conflict", async () => {
      const existingResource = {
        _id: validBookingPayload.resourceId,
        name: "Seminar Hall",
        capacity: 100,
        location: "Block C",
        status: "available",
      };

      const createdBooking = {
        _id: "6c01714644c1a8dc0ad81111",
        ...validBookingPayload,
        createdAt: "2026-05-20T08:00:00.000Z",
        updatedAt: "2026-05-20T08:00:00.000Z",
      };

      jest.spyOn(Resource, "findById").mockResolvedValue(existingResource);
      jest.spyOn(Booking, "findOne").mockResolvedValue(null);
      const createSpy = jest
        .spyOn(Booking, "create")
        .mockResolvedValue(createdBooking);

      const response = await request(app)
        .post("/api/bookings")
        .send(validBookingPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdBooking);
      expect(createSpy).toHaveBeenCalledWith(validBookingPayload);
    });

    it("should return status 400 when booking creation fails due to validation or error", async () => {
      jest
        .spyOn(Resource, "findById")
        .mockRejectedValue(new Error("Invalid resourceId format"));

      const response = await request(app)
        .post("/api/bookings")
        .send(validBookingPayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid resourceId format");
    });
  });

  describe("GET /api/bookings", () => {
    it("should return all bookings populated with resource details with status 200", async () => {
      const mockBookings = [
        {
          _id: "6c01714644c1a8dc0ad81111",
          userName: "Kamal Perera",
          resourceId: {
            _id: "6a01714644c1a8dc0ad8323e",
            name: "Lecture Hall A",
            capacity: 130,
            location: "Applied Building",
          },
          date: "2026-05-20",
          startTime: "10:00",
          endTime: "12:00",
        },
      ];

      const populateMock = jest.fn().mockResolvedValue(mockBookings);
      jest.spyOn(Booking, "find").mockReturnValue({
        populate: populateMock,
      });

      const response = await request(app).get("/api/bookings");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
      expect(populateMock).toHaveBeenCalledWith("resourceId");
    });

    it("should return status 500 when database error occurs while fetching bookings", async () => {
      const populateMock = jest
        .fn()
        .mockRejectedValue(new Error("Failed to populate bookings"));
      jest.spyOn(Booking, "find").mockReturnValue({
        populate: populateMock,
      });

      const response = await request(app).get("/api/bookings");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Failed to populate bookings");
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    it("should successfully delete a booking by ID and return status 200", async () => {
      const bookingId = "6c01714644c1a8dc0ad81111";
      const deleteSpy = jest
        .spyOn(Booking, "findByIdAndDelete")
        .mockResolvedValue({ _id: bookingId });

      const response = await request(app).delete(`/api/bookings/${bookingId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Booking deleted successfully" });
      expect(deleteSpy).toHaveBeenCalledWith(bookingId);
    });

    it("should return status 500 when error occurs during booking deletion", async () => {
      const bookingId = "6c01714644c1a8dc0ad81111";
      jest
        .spyOn(Booking, "findByIdAndDelete")
        .mockRejectedValue(new Error("Database delete operation failed"));

      const response = await request(app).delete(`/api/bookings/${bookingId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "message",
        "Database delete operation failed"
      );
    });
  });
});
