import jwt from "jsonwebtoken";

/**
 * Middleware: Authenticates the request by validating the JWT Access Token.
 */
export const authenticateMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // No auth header, proceed as unauthenticated (anonymous request)
    if (!authHeader) {
      return next();
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: Invalid authentication scheme",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token signature + expiration
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach validated identity into request scope
    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or expired token",
    });
  }
};

/**
 * Middleware: Validates that a user context exists for protected routes.
 */
export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: Authentication required",
    });
  }

  return next();
};
