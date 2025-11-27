import fs from "node:fs";

// Middleware to log requests
export const loggingMiddleware = (req, _res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} - ${req.url}\n`;
  fs.appendFileSync("./logs/access.log", log, "utf-8");

  // Move to the next middleware
  next();
};
