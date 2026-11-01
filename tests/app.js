import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

import resourceRoutes from "../routes/resourceRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";
import authRoutes from "../routes/authRoutes.js";

/**
 * Creates an Express application configured for testing.
 * Matches the route mounts and middleware of index.js
 * while using an in-memory session store by default so tests
 * do not depend on a live MongoDB connection.
 */
export const createTestApp = (sessionOptions = {}) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(express.json());

  app.use(
    session({
      secret: "SecretKey",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
      ...sessionOptions,
    })
  );

  app.use("/api/resources", resourceRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/auth", authRoutes);

  return app;
};

export const app = createTestApp();
export default app;
