/**
 * Role-Based Access Control Middleware
 * Checks whether the authenticated user has one of the allowed roles.
 *
 * @param {...string} allowedRoles - E.g. 'OWNER', 'ADMIN'
 * @returns {Function} Express middleware
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { message: 'Authentication required before authorization check.' },
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}.`,
        },
      });
    }

    next();
  };
};

export default authorize;
