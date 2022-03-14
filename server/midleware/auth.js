const jwt = require("jsonwebtoken");
const User = require("../Models/user");

isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Please Login to access this resource",success:false});
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isAuthenticatedUser;
