import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found"
      });
    }

    req.user = user; // 🔥 important
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token"
    });
  }
};

//now allow the admin only route

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied, admin only"
    });
  }
};

