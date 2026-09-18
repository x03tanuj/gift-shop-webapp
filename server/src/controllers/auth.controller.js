import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'uphaar_secret_jwt_key_development_2026';
export const COOKIE_NAME = 'admin_token';

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};

/**
 * POST /api/auth/login
 * Validates credentials, issues JWT in an httpOnly cookie, and returns the user object.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Both email and password are required.' },
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: { message: 'Invalid email or password.' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: { message: 'Invalid email or password.' },
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure httpOnly session cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.json({
      user,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clears the session cookie.
 */
export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  return res.json({ message: 'Logged out successfully' });
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user from req.user (populated by authenticate middleware).
 */
export const getCurrentUser = async (req, res) => {
  return res.json({ user: req.user });
};
