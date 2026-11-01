import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "./app.js";
import User from "../models/user.js";
import Resource from "../models/resource.js";
import Booking from "../models/booking.js";

describe("End-to-End System Integration Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should complete a full lifecycle: auth -> resource management -> booking -> conflict detection -> cleanup", async () => {
    const agent = request.agent(app);

    // 1. User Registration
    const registrationPayload = {
      name: "Saman Perera",
      email: "saman@campus.edu",
      password: "SafePassword123",
      role: "admin",
    };

    const mockHashedPass = "$2b$10$mockHashedUserPassword";
    const mockUser = {
      _id: "6a01714644c1a8dc0ad80099",
      name: registrationPayload.name,
      email: registrationPayload.email,
      password: mockHashedPass,
      role: "admin",
    };

    jest.spyOn(bcrypt, "hash").mockResolvedValue(mockHashedPass);
    jest.spyOn(User, "create").mockResolvedValue(mockUser);

    const registerRes = await agent
      .post("/api/auth/register")
      .send(registrationPayload);

    expect(registerRes.status).toBe(200);
    expect(registerRes.body.message).toBe("User created");
    expect(registerRes.body.user.email).toBe("saman@campus.edu");

    // 2. User Login
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: "saman@campus.edu", password: "SafePassword123" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.message).toBe("Login successful");
    expect(loginRes.body.user.role).toBe("admin");

    // 3. Create Resource
    const resourcePayload = {
      name: "Conference Hall B",
      capacity: 80,
      location: "Admin Block",
      status: "available",
    };

    const mockCreatedResource = {
      _id: "6a01714644c1a8dc0ad80077",
      ...resourcePayload,
    };

    jest.spyOn(Resource, "create").mockResolvedValue(mockCreatedResource);

    const createResourceRes = await agent
      .post("/api/resources")
      .send(resourcePayload);

    expect(createResourceRes.status).toBe(201);
    expect(createResourceRes.body._id).toBe(mockCreatedResource._id);

    // 4. Retrieve Resources
    jest.spyOn(Resource, "find").mockResolvedValue([mockCreatedResource]);

    const getResourcesRes = await agent.get("/api/resources");
    expect(getResourcesRes.status).toBe(200);
    expect(getResourcesRes.body.length).toBe(1);
    expect(getResourcesRes.body[0].name).toBe("Conference Hall B");

    // 5. Update Resource
    const updatedResourceData = {
      ...mockCreatedResource,
      capacity: 100,
    };
    jest
      .spyOn(Resource, "findByIdAndUpdate")
      .mockResolvedValue(updatedResourceData);

    const updateResourceRes = await agent
      .put(`/api/resources/${mockCreatedResource._id}`)
      .send({ capacity: 100 });

    expect(updateResourceRes.status).toBe(200);
    expect(updateResourceRes.body.capacity).toBe(100);

    // 6. Create Booking for Resource
    const bookingPayload = {
      userName: "Saman Perera",
      resourceId: mockCreatedResource._id,
      date: "2026-06-01",
      startTime: "09:00",
      endTime: "11:00",
    };

    const mockCreatedBooking = {
      _id: "6b01714644c1a8dc0ad80088",
      ...bookingPayload,
    };

    jest.spyOn(Resource, "findById").mockResolvedValue(updatedResourceData);
    jest.spyOn(Booking, "findOne").mockResolvedValue(null);
    jest.spyOn(Booking, "create").mockResolvedValue(mockCreatedBooking);

    const createBookingRes = await agent
      .post("/api/bookings")
      .send(bookingPayload);

    expect(createBookingRes.status).toBe(201);
    expect(createBookingRes.body._id).toBe(mockCreatedBooking._id);

    // 7. Prevent Overlapping Double Booking
    const overlappingPayload = {
      userName: "Another Student",
      resourceId: mockCreatedResource._id,
      date: "2026-06-01",
      startTime: "10:00",
      endTime: "12:00",
    };

    jest.spyOn(Resource, "findById").mockResolvedValue(updatedResourceData);
    jest.spyOn(Booking, "findOne").mockResolvedValue(mockCreatedBooking);

    const conflictRes = await agent
      .post("/api/bookings")
      .send(overlappingPayload);

    expect(conflictRes.status).toBe(400);
    expect(conflictRes.body.message).toBe("Resource already booked for this time");

    // 8. Fetch Bookings
    const populatedBookings = [
      {
        ...mockCreatedBooking,
        resourceId: updatedResourceData,
      },
    ];
    jest.spyOn(Booking, "find").mockReturnValue({
      populate: jest.fn().mockResolvedValue(populatedBookings),
    });

    const getBookingsRes = await agent.get("/api/bookings");
    expect(getBookingsRes.status).toBe(200);
    expect(getBookingsRes.body.length).toBe(1);
    expect(getBookingsRes.body[0].resourceId.name).toBe("Conference Hall B");

    // 9. Delete Booking
    jest
      .spyOn(Booking, "findByIdAndDelete")
      .mockResolvedValue({ _id: mockCreatedBooking._id });

    const deleteBookingRes = await agent.delete(
      `/api/bookings/${mockCreatedBooking._id}`
    );
    expect(deleteBookingRes.status).toBe(200);
    expect(deleteBookingRes.body.message).toBe("Booking deleted successfully");

    // 10. Delete Resource
    jest
      .spyOn(Resource, "findByIdAndDelete")
      .mockResolvedValue({ _id: mockCreatedResource._id });

    const deleteResourceRes = await agent.delete(
      `/api/resources/${mockCreatedResource._id}`
    );
    expect(deleteResourceRes.status).toBe(200);
    expect(deleteResourceRes.body.message).toBe("Resource deleted successfully");

    // 11. User Logout
    const logoutRes = await agent.post("/api/auth/logout");
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe("Logged out");
  });
});
