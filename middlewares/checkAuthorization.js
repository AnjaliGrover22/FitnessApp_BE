const checkAuthorization = (roles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. No user found." });
      }

      if (!roles.includes(user.role)) {
        return res.status(401).json({ message: "Unauthorized." });
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
};

module.exports = checkAuthorization;
