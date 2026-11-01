import { describe, it, expect, jest } from "@jest/globals";
import express from "express";
import session from "express-session";
import request from "supertest";

// Provide global exports object so CommonJS exports assignment in ESM file succeeds without altering project source
globalThis.exports = globalThis.exports || {};

// Dynamically import middleware modules
await import("../middleware/authMiddleware.js");
const { isAuthenticated } = globalThis.exports;

await import("../middleware/roleMiddleware.js");
const { isAdmin } = globalThis.exports;

describe("Middleware Tests", () => {
  describe("authMiddleware - isAuthenticated", () => {
    it("should return status 401 when req.session.user is not present", () => {
      const req = { session: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      isAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Please login first" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() when req.session.user is present", () => {
      const req = {
        session: {
          user: { id: "user123", role: "user" },
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should protect route and return 401 when unauthenticated via Supertest", async () => {
      const app = express();
      app.use(session({ secret: "test", resave: false, saveUninitialized: false }));
      app.get("/protected", isAuthenticated, (req, res) => res.json({ data: "secret" }));

      const res = await request(app).get("/protected");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Please login first" });
    });

    it("should grant access to protected route when authenticated via Supertest", async () => {
      const app = express();
      app.use(session({ secret: "test", resave: false, saveUninitialized: true }));
      // Middleware simulating authenticated session
      app.use((req, res, next) => {
        req.session.user = { id: "user123", role: "user" };
        next();
      });
      app.get("/protected", isAuthenticated, (req, res) => res.json({ data: "secret" }));

      const res = await request(app).get("/protected");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: "secret" });
    });
  });

  describe("roleMiddleware - isAdmin", () => {
    it("should return status 403 when req.session.user.role is not 'admin'", () => {
      const req = {
        session: {
          user: { id: "user123", role: "user" },
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Admins only" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() when req.session.user.role is 'admin'", () => {
      const req = {
        session: {
          user: { id: "admin123", role: "admin" },
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject non-admin users with 403 via Supertest", async () => {
      const app = express();
      app.use(session({ secret: "test", resave: false, saveUninitialized: true }));
      app.use((req, res, next) => {
        req.session.user = { id: "user123", role: "student" };
        next();
      });
      app.get("/admin-only", isAdmin, (req, res) => res.json({ data: "admin data" }));

      const res = await request(app).get("/admin-only");
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: "Admins only" });
    });

    it("should allow admin users through via Supertest", async () => {
      const app = express();
      app.use(session({ secret: "test", resave: false, saveUninitialized: true }));
      app.use((req, res, next) => {
        req.session.user = { id: "admin123", role: "admin" };
        next();
      });
      app.get("/admin-only", isAdmin, (req, res) => res.json({ data: "admin data" }));

      const res = await request(app).get("/admin-only");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: "admin data" });
    });
  });
});
