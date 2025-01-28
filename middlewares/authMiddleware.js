// checkRole middleware for ensuring user roles
const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming user role is stored in `req.user`

    if (roles.includes(userRole)) {
      return next();
    }
    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient permissions" });
  };
};

module.exports = { checkRole };
