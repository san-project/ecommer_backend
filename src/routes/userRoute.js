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

// router.put("/:id", verifyToken, async (req, res) => {
//   const allowedUpdates = ["name", "email", "password", "address"];
//   const updates = Object.keys(req.body);
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   console.log(updates);
//   console.log(isValidOperation);
//   if (req.user._id != req.params.id) {
//     return res.status(403).json({
//       message: "You are not authorized to perform this action",
//     });
//   }
//   const { profilePic } = req.body;
//   try {
//     if (profilePic) {
//       const profile = await cloudinary.uploader.upload(profilePic, {
//         folder: "profiles",
//       });
//       const fuser = await userModel.findById(req.params.id);
//       console.log(fuser);
//       const updatedUser = await userModel.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );
//       return res.status(200).json(updatedUser);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "internal server error",
//     });
//   }
// });

router.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "address", "profile"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
