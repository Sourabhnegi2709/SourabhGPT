import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = (req, res, next) => {
  const JWT_SECRET = getJwtSecret();
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader?.split(" ")[1];
  
  if (!token) {
    console.error("Auth failed: no token provided", { authorizationHeader });
    return res.status(401).json({ message: "No token provided" });
  }

  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message, {
      authorizationHeader,
      tokenLength: token?.length,
    });
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
