export default function authorizeAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Access denied",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}