import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Role-based access
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied: Admin only" });
  next();
};

export const isHost = (req, res, next) => {
  if (req.user.role !== "host")
    return res.status(403).json({ message: "Access denied: Host only" });
  next();
};

export const isUser = (req, res, next) => {
  if (req.user.role !== "user")
    return res.status(403).json({ message: "Access denied: User only" });
  next();
};
