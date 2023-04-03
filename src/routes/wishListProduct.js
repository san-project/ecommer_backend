import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    console.log(req.user.id);
    // res.send("get all wishlist");
    const wishListProducts = await Wishlist.find({
      userId: req.user.id,
    }).populate({
      path: "products",
    });
    console.log(wishListProducts);
    res.status(200).json({
      status: true,
      wishListProducts,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId: userId });
    if (wishlist) {
      const itemId = wishlist.products.findIndex((item) => item == productId);
      if (itemId === -1) {
        wishlist.products.push(productId);
        const updatedwishlist = await wishlist.save();
        res.send(updatedwishlist);
      }
      console.log(itemId);
    } else {
      const newWishlist = await Wishlist.create({
        userId,
        products: [productId],
      });
      return res.status(201).json({
        status: true,
        message: "added to wishlist successfully",
        newWishlist,
      });
    }
    // console.log("post request");
    // console.log(productId);
    // const wishListProducts = await Wishlist.find({
    //     userId: req.user.id,
    //   });
    // if (wishListProducts) {
    //     Wishlist.findOneAndUpdate()
    // }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/", verifyToken, async (req, res) => {
  console.log(
    "=====================deleting products========================="
  );
  const productId = req.body.productId;
  if (!productId) {
    return res.status(400).json({
      status: false,
      message: "please send productId",
    });
  }
  try {
    console.log("getting products");
    const product = await Product.findById(productId);
    console.log("getting products----");
    console.log(`product in delete ${product}`);
    if (!product) {
      res.status(400).json({
        status: false,
        message: "No product is found with the given id",
      });
    }
    console.log(`user id is `);
    const deleted = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      {
        $pull: { products: productId },
      }
    );
    console.log(deleted);
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
