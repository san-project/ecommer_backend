import express from "express";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import User from "../models/user.js";
import JWT from "jsonwebtoken";
const router = express.Router();

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
  console.log( `hashed pasword====>${hashedPassword}`);
  const user = new User({
    name,
    email,
    password:hashedPassword,
  });
  try {
    const savedUser = await user.save();
    console.log(savedUser);
    const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET,{
      expiresIn: 30
    });
    return res.json({ 
      "status": true,
      message: "registered successfully",
      user: {
        _id: user._id,
        token:token,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      }
     }).status(200);
    
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
      const token = JWT.sign({_id: user._id}, process.env.JWT_SECRET,{
        expiresIn: 30
      });
      return res.json({ 
        "status": true,
        message: "login successfully",
        user: {
          _id: user._id,
          token:token,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        }
       }).status(200);
      
    } else {
      return res.json({ message: "user not found" }).status(200);
    }
  }
  } catch (error) {
    console.log(error);
  }
  
});

export default router;
