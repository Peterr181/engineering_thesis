import jwt from "jsonwebtoken";
import crypto from "crypto";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decode the token without verifying to extract the secret part
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { payload } = decodedToken;
    const jwtSecret = `${payload.username}-${payload.secret}`;

    // Verify the token using the extracted secret
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.username = decoded.username;
      next();
    });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
