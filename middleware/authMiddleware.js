
import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log("🔑 Token received:", token);

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);  //log decoded token
    req.user = { userId: decoded.userId };  
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}
