/**
 * Reusable Role Authorization Middleware
 * Gating routes based on required user roles.
 *
 * Usage:
 * router.get('/admin-only', protect, requireRole('admin'), handler);
 * router.get('/multi-role', protect, requireRole('industry', 'admin'), handler);
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking role permissions.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] role. Current role: '${req.user.role}'`,
      });
    }

    next();
  };
};

module.exports = {
  requireRole,
};
