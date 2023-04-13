import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Wishlist from "../models/wishlistModel.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    console.log(req.user._id);
    const wishListProducts = await Wishlist.findOne({
      userId: req.user._id,
    }).populate({
      path: "products",
      populate: [
        {
          path: "category",
        },
        {
          path: "seller",
          select: "seller businessName",
        },
      ],
    });
    console.log(wishListProducts);
    res.status(200).json({
      status: true,
      wishListProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "internal server error",
      error,
    });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { products: productId } },
      { upsert: true, new: true }
    ).populate("products");
    res.status(200).json(wishlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "internal server error",
      error,
    });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  console.log(
    "=====================deleting products========================="
  );
  const userId = req.user._id;
  const productId = req.body.productId;
  if (!productId) {
    return res.status(400).json({
      status: false,
      message: "please send productId",
    });
  }
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products");

    res.json({ wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "internal server error",
      error,
    });
  }
});

export default router;
