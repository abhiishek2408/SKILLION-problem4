import jwt from "jsonwebtoken";
import config from "../config.js";
import User from "../models/User.js";
import { ApiError } from "../utils/errors.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw ApiError("UNAUTHORIZED", "Missing Authorization header", null, 401);

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.sub);
    if (!user) throw ApiError("UNAUTHORIZED", "User not found", null, 401);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}


export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError("UNAUTHORIZED", "Not authenticated", null, 401));

    const userRole = req.user.role.toLowerCase();
    if (userRole !== role.toLowerCase() && userRole !== "admin") {
      return next(ApiError("FORBIDDEN", "Insufficient role", null, 403));
    }

    next();
  };
}
