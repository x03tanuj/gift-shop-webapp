import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'uphaar_secret_jwt_key_development_2026';

/**
 * Middleware: Verifies the JWT session token from the httpOnly cookie (or Bearer header).
 * Attaches the authenticated user document to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    // Check cookie first, fallback to Authorization header
    const token =
      req.cookies?.admin_token ||
      req.headers?.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(401).json({
        error: { message: 'Authentication required. No session active.' },
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        error: {
          message:
            err.name === 'TokenExpiredError'
              ? 'Session expired. Please log in again.'
              : 'Invalid authentication token.',
        },
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: { message: 'User account not found or is deactivated.' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
