import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params.id;

  if (req.user._id != req.params.id) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }
  try {
    res.status(200).json({
      succes: true,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  if (req.user._id != req.params.id) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }
  const { profilePic } = req.body;
  try {
    if (profilePic) {
      const profile = await cloudinary.uploader.upload(profilePic, {
        folder: "profiles",
      });

      const fuser = await userModel.findById(req.params.id);
      console.log(fuser);
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

export default router;
