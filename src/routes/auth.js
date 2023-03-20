import express from "express";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import User from "../models/user.js";
import Seller from "../models/sellerModel.js";
import JWT from "jsonwebtoken";
const router = express.Router();

router.post("/seller/register", async (req, res) => {
  const { name, email, password, businessName, address, mobile } = req.body;
  if (!name || !email || !password || !businessName || !address || !mobile) {
    return res.status(400).json({
      status: false,
      message: "please enter all fields",
    });
  } else {
    try {
      const isExistingSeller =
        (await Seller.findOne({ email: email })) ||
        (await Seller.findOne({ mobile }));
      if (isExistingSeller) {
        return res.status(409).json({
          status: false,
          message: "Seller already found with same email or mobile number",
        });
      }
      const hashedPassword = await hashPassword(password);
      const newSeller = new Seller({
        name,
        password: hashedPassword,
        email,
        address,
        businessName,
        mobile,
      });
      await newSeller.save();
      res.status(201).json({
        status: true,
        message:
          "You have been registered successfully please wait until you've been approved",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Serval Error",
        description: error,
      });
    }
  }
});

router.post("/seller/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "please enter all fields",
      });
    }
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(40).json({
        status: false,
        message: "User Not Found",
      });
    }
    const match = await comparePassword(password, seller.password);
    if (!seller.isApproved) {
      return res.status(401).json({
        status: false,
        message:
          "You have not been approved to login, please wait until you will get approved",
      });
    }
    if (match) {
      const token = JWT.sign({ _id: seller._id }, process.env.JWT_SECRET, {
        expiresIn: 30,
      });
      return res.status(200).json({
        status: true,
        id: seller._id,
        name: seller.name,
        businessName: seller.businessName,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Serval Error",
      description: error,
    });
  }
});

//USER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.json({ message: "please enter name" }).status(400);
  }
  if (!email) {
    return res.json({ message: "please enter email" }).status(400);
  }
  if (!password) {
    return res.json({ message: "please enter password" }).status(400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .json({ message: "User already registered with this email" })
      .status(200);
  }
  const hashedPassword = await hashPassword(password);
  console.log(`hashed pasword====>${hashedPassword}`);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    console.log(savedUser);
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 30,
    });
    return res
      .json({
        status: true,
        message: "registered successfully",
        user: {
          _id: user._id,
          token: token,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      })
      .status(200);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "please enter all fields" }).status(400);
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .json({ message: "cannot find the user with the provided email" })
          .status(400);
      }
      const match = await comparePassword(password, user.password);
      if (match) {
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 30,
        });
        return res
          .json({
            status: true,
            message: "login successfully",
            user: {
              _id: user._id,
              token: token,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
            },
          })
          .status(200);
      } else {
        return res.json({ message: "user not found" }).status(200);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
