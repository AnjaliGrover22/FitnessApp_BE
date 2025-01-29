const jwt = require("jsonwebtoken");
const User = require("../schemas/User");

const requireAuth = (role = null) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    // Check if the user has a valid token in the request headers
    if (!authorization) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    // Extract the token from the 'Authorization' header
    const token = authorization.split(" ")[1];

    try {
      // Verify the token and extract the user's ID
      const { _id } = jwt.verify(token, process.env.SECRET);

      // Find the user by ID and select their role
      const user = await User.findById(_id).select("_id role");

      // Check if the user was found, else return an error
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Attach user information to the request object (for use in route handlers)
      req.user = { id: user._id, role: user.role };

      // Role Check: If a role is specified, check if the user's role matches
      if (role && user.role !== role) {
        return res.status(403).json({ error: "Access Denied" });
      }

      // If everything checks out, proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Invalid token", details: error.message });
    }
  };
};

module.exports = requireAuth;
