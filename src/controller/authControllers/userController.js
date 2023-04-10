import { comparePassword, hashPassword } from "../../helpers/authHelper.js";
import User from "../../models/userModel.js";
import JWT from "jsonwebtoken";
import Wishlist from "../../models/wishlistModel.js";

export const userRegister = async (req, res) => {
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
    await Wishlist({
      userId: savedUser._id,
      products: [],
    }).save();
    console.log(savedUser);
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
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
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "please enter all fields" }).status(400);
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Can not find user with provided email",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(401).json({
          status: false,
          message: "Invalid Credentials",
        });
      }

      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).json({
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
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
