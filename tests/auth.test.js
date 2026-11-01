import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "./app.js";
import User from "../models/user.js";

describe("Auth Routes - /api/auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should successfully register a user with default role 'user' and hashed password", async () => {
      const registerPayload = {
        name: "Kamal Silva",
        email: "kamal@campus.edu",
        password: "StrongPass123",
      };

      const hashedPassword = "mockHashedPassword$123";
      const createdUser = {
        _id: "6a01714644c1a8dc0ad80001",
        name: registerPayload.name,
        email: registerPayload.email,
        password: hashedPassword,
        role: "user",
      };

      const hashSpy = jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);
      const createSpy = jest.spyOn(User, "create").mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "User created",
        user: createdUser,
      });

      expect(hashSpy).toHaveBeenCalledWith("StrongPass123", 10);
      expect(createSpy).toHaveBeenCalledWith({
        name: "Kamal Silva",
        email: "kamal@campus.edu",
        password: hashedPassword,
        role: "user",
      });
    });

    it("should register a user with explicit role when specified", async () => {
      const registerPayload = {
        name: "Admin User",
        email: "admin@campus.edu",
        password: "AdminPass123",
        role: "admin",
      };

      const hashedPassword = "mockHashedPassword$admin";
      const createdUser = {
        _id: "6a01714644c1a8dc0ad80002",
        name: registerPayload.name,
        email: registerPayload.email,
        password: hashedPassword,
        role: "admin",
      };

      jest.spyOn(bcrypt, "hash").mockResolvedValue(hashedPassword);
      const createSpy = jest.spyOn(User, "create").mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerPayload);

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe("admin");
      expect(createSpy).toHaveBeenCalledWith({
        name: "Admin User",
        email: "admin@campus.edu",
        password: hashedPassword,
        role: "admin",
      });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return status 400 with 'User not found' if email does not exist", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "unknown@campus.edu", password: "SomePassword" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "User not found" });
    });

    it("should return status 400 with 'Wrong password' if password does not match", async () => {
      const existingUser = {
        _id: "6a01714644c1a8dc0ad80001",
        email: "kamal@campus.edu",
        password: "storedHashedPassword",
        role: "user",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "kamal@campus.edu", password: "IncorrectPassword" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Wrong password" });
    });

    it("should return status 200 with 'Login successful' and user info when credentials match", async () => {
      const existingUser = {
        _id: "6a01714644c1a8dc0ad80001",
        email: "kamal@campus.edu",
        password: "storedHashedPassword",
        role: "user",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "kamal@campus.edu", password: "StrongPass123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login successful",
        user: {
          email: "kamal@campus.edu",
          role: "user",
        },
      });
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return status 200 with 'Logged out'", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Logged out" });
    });

    it("should handle session lifecycle across login and logout with supertest agent", async () => {
      const agent = request.agent(app);

      const existingUser = {
        _id: "6a01714644c1a8dc0ad80001",
        email: "kamal@campus.edu",
        password: "storedHashedPassword",
        role: "user",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const loginRes = await agent
        .post("/api/auth/login")
        .send({ email: "kamal@campus.edu", password: "StrongPass123" });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.message).toBe("Login successful");

      const logoutRes = await agent.post("/api/auth/logout");
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body).toEqual({ message: "Logged out" });
    });
  });
});
