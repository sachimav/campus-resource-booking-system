import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import app from "./app.js";
import Resource from "../models/resource.js";

describe("Resource Routes - /api/resources", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /api/resources", () => {
    it("should successfully create a new resource and return status 201", async () => {
      const newResourceData = {
        name: "Main Auditorium",
        capacity: 500,
        location: "Block A",
        status: "available",
      };

      const createdResource = {
        _id: "6a01714644c1a8dc0ad83210",
        ...newResourceData,
        createdAt: "2026-11-01T00:00:00.000Z",
        updatedAt: "2026-11-01T00:00:00.000Z",
      };

      const createSpy = jest.spyOn(Resource, "create").mockResolvedValue(createdResource);

      const response = await request(app)
        .post("/api/resources")
        .send(newResourceData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdResource);
      expect(createSpy).toHaveBeenCalledWith(newResourceData);
    });

    it("should return status 400 when resource creation encounters a validation error", async () => {
      const invalidData = {
        name: "Incomplete Resource",
      };

      jest
        .spyOn(Resource, "create")
        .mockRejectedValue(new Error("Resource validation failed: capacity is required"));

      const response = await request(app)
        .post("/api/resources")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Resource validation failed");
    });
  });

  describe("GET /api/resources", () => {
    it("should return all resources with status 200", async () => {
      const mockResources = [
        {
          _id: "6a01714644c1a8dc0ad83210",
          name: "Main Auditorium",
          capacity: 500,
          location: "Block A",
          status: "available",
        },
        {
          _id: "6a01714644c1a8dc0ad83211",
          name: "Computer Lab 1",
          capacity: 40,
          location: "Block B",
          status: "available",
        },
      ];

      jest.spyOn(Resource, "find").mockResolvedValue(mockResources);

      const response = await request(app).get("/api/resources");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResources);
      expect(response.body.length).toBe(2);
    });

    it("should return an empty list with status 200 when no resources are found", async () => {
      jest.spyOn(Resource, "find").mockResolvedValue([]);

      const response = await request(app).get("/api/resources");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return status 500 when database error occurs while fetching resources", async () => {
      jest
        .spyOn(Resource, "find")
        .mockRejectedValue(new Error("Database connection failure"));

      const response = await request(app).get("/api/resources");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Database connection failure");
    });
  });

  describe("PUT /api/resources/:id", () => {
    it("should successfully update an existing resource and return status 200", async () => {
      const resourceId = "6a01714644c1a8dc0ad83210";
      const updateData = {
        capacity: 550,
        status: "maintenance",
      };

      const updatedResource = {
        _id: resourceId,
        name: "Main Auditorium",
        capacity: 550,
        location: "Block A",
        status: "maintenance",
      };

      const updateSpy = jest
        .spyOn(Resource, "findByIdAndUpdate")
        .mockResolvedValue(updatedResource);

      const response = await request(app)
        .put(`/api/resources/${resourceId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedResource);
      expect(updateSpy).toHaveBeenCalledWith(resourceId, updateData, { new: true });
    });

    it("should return status 400 when updating a resource fails", async () => {
      const resourceId = "invalid-id";
      jest
        .spyOn(Resource, "findByIdAndUpdate")
        .mockRejectedValue(new Error("Cast to ObjectId failed"));

      const response = await request(app)
        .put(`/api/resources/${resourceId}`)
        .send({ status: "booked" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Cast to ObjectId failed");
    });
  });

  describe("DELETE /api/resources/:id", () => {
    it("should successfully delete a resource by ID and return status 200", async () => {
      const resourceId = "6a01714644c1a8dc0ad83210";
      const deleteSpy = jest
        .spyOn(Resource, "findByIdAndDelete")
        .mockResolvedValue({ _id: resourceId });

      const response = await request(app).delete(`/api/resources/${resourceId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Resource deleted successfully" });
      expect(deleteSpy).toHaveBeenCalledWith(resourceId);
    });

    it("should return status 500 when an error occurs during resource deletion", async () => {
      const resourceId = "6a01714644c1a8dc0ad83210";
      jest
        .spyOn(Resource, "findByIdAndDelete")
        .mockRejectedValue(new Error("Database write error"));

      const response = await request(app).delete(`/api/resources/${resourceId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Database write error");
    });
  });
});
