import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import userModel from "../models/userModel.js";
const router = express.Router();

router.put("/:id", verifyToken, async (req, res, next) => {
  if (req.user.id != req.params.id) {
    return res.status(403).json({
      message: "You are not authorized to perform this action",
    });
  }
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

export default router;
