import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("no header?");
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token!" }); // Forbidden
    }

    // Attach user info to req
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  });
};

export default verifyJWT;
