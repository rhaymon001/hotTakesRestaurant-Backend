import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided!" }); // Unauthorized
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Token expired
        return res.status(401).json({ message: "Access token expired!" });
      }
      // Token exists but invalid signature/format
      return res.status(403).json({ message: "Invalid token!" });
    }

    // ✅ Attach user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  });
};

export default verifyJWT;
