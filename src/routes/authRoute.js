import express from "express";

import {
  sellerLogin,
  sellerRegister,
} from "../controller/authControllers/sellerController.js";
import {
  userLogin,
  userRegister,
  sendOtpVerifcation,
  verifyOtp,
  changePassword,
} from "../controller/authControllers/userController.js";
import User from "../models/userModel.js";
const router = express.Router();

//seller
router.post("/seller/register", sellerRegister);

router.post("/seller/login", sellerLogin);

//USER
router.post("/user/register", userRegister);

router.post("/user/login", userLogin);
router.post("/user/forgot_password", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const id = existingUser._id.toString();
    console.log(id);
    const otp = await sendOtpVerifcation({ email, id });
    res.json({
      status: "pending",
      message: "otp sent successfully",
      id: otp._id,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
});

router.post("/user/verifyOtp", verifyOtp);
router.put("/user/changepassword", changePassword);

export default router;
