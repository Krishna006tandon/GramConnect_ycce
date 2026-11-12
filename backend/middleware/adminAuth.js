/**
 * Admin protection middleware for sensitive scheme synchronization routes.
 * Set ADMIN_SYNC_SECRET in backend/.env to enforce Bearer / x-admin-secret auth.
 */
export function adminOnly(req, res, next) {
  const configuredSecret = process.env.ADMIN_SYNC_SECRET;
  if (!configuredSecret) {
    // Prototype fallback when no ADMIN_SYNC_SECRET is configured in .env
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const headerSecret = req.headers["x-admin-secret"] || bearerToken;

  if (headerSecret !== configuredSecret) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing Admin Sync secret."
    });
  }

  return next();
}
