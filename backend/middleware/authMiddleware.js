import jwt from "jsonwebtoken";

/**
 * Express middleware that enforces JWT‑based authentication.
 *
 * Expects an Authorization header in the form:
 *   "Bearer <token>"
 *
 * On success, the decoded payload is attached to `req.user` and the request
 * continues to the next handler. Otherwise a 401 response is returned.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
