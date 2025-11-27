import { eq, ne } from "drizzle-orm";
import { db } from "../db/index.js";
import jwt from "jsonwebtoken";

export const authenticationMiddleware = async (req, res, next) => {
  // Session based authentication

  // const sessionId = req.headers["x-session-id"];

  // if (!sessionId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // const [user] = await db
  //   .select({
  //     id: userSessionTable.id,
  //     name: userTable.name,
  //     userId: userTable.id,
  //     email: userTable.email,
  //   })
  //   .from(userSessionTable)
  //   .where((table) => eq(table.id, sessionId))
  //   .rightJoin(userTable, eq(userTable.id, userSessionTable.userId));

  // JWT authentication
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) {
    return next();
  }

  if (!tokenHeader.startsWith("Bearer")) {
    return res.status(400).json({ message: "authorization header is missing" });
  }
  const token = tokenHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!user) {
      next();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const authorizedMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
