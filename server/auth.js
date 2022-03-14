const router = require("express").Router();
const sendToken = require("./utils/sendToken");
const sendEmail = require("./utils/sendEmail");
const User = require("./Models/user");
const isAuthenticated = require("./midleware/auth");

router.post("/register", async (req, res, next) => {
  try {
    let findUser = await User.findOne({ email: req.body.email });
    if (findUser) {
      return res
        .status(401)
        .json({ error: "User already exists with this email" });
    }
    
    const { phone, email, password } = req.body;
    const user = await User.create({
      phone,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/user", isAuthenticated, async (req, res, next) => {
  try {
    let user;
    if (req.user.id) {
      user = await User.findById(req.user.id);
    }
    if (!user) {
      res
        .status(400)
        .json({ error: `User does not exits with id  ${req.user.id}` });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ error: "Password or email is invalid" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({ error: "User not found !. Please registe first" });

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

router.put("/password/forgot", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
// 
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;

    const message = `Your password reset link is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
      await sendEmail({
        email: user.email,
        subject: `Password Recovery`,
        message,
      });

       res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error)
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: "Internal Server error" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});

router.put("/password/reset/:token", async (req, res, next) => {
  try {
    const resetPasswordToken = req.params.token;

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Reset Password Token is invalid or has been expired" });
    }
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
});
module.exports = router;
