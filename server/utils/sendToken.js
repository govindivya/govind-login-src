// This is to send jwt token

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const options = {
    maxAge : new Date(Date.now()+process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};

module.exports = sendToken;
