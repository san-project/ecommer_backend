import express from "express";
import Product from "../models/productModel.js";
import { verifySeller } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../helpers/cloudinaryConfig.js";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();

router.get("/get", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(401).json({
      message: "pass product id in params",
    });
  }
  try {
  } catch (error) {}
  res.json({
    message: "laksdcn",
  });
});
// router.post("/", async (req, res, next) => {
//   const files = req.files.images;
//   // console.log(files);
//   const url = await uploadFiles(files);
//   console.log(`$urls in route====> ${url}`);
//   res.json({
//     ...url,
//   });
// });
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("category")
//       .populate("seller");
//     console.log(products);
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: "Internal Serval Error",
//       description: error,
//     });
//   }
// });

router.post("/", verifySeller, async (req, res) => {
  const { name, description, categoryId, brand, price, countInStock } =
    req.body;
  console.log(req.body);
  console.log(req.files);
  const images = req.files.images;
  const thumbnail = req.files.thumbnail;
  if (
    !name ||
    !description ||
    !categoryId ||
    !brand ||
    !price ||
    !countInStock ||
    !images ||
    !thumbnail
  ) {
    return res.status(400).json({
      message: "fill all the fields",
    });
  }
  try {
    const url = await uploadFiles(images);
    const thumbnailUrl = await cloudinary.uploader.upload(
      thumbnail.tempFilePath,
      {
        folder: "products",
      }
    );
    const newProduct = new Product({
      name,
      description,
      category: categoryId,
      brand,
      price,
      countInStock,
      images: url,
      seller: req.seller._id,
      thumbnail: {
        url: thumbnailUrl.url,
        public_id: thumbnailUrl.public_id,
      },
    });
    const savedProduct = await newProduct.save();
    return res.status(200).json({
      success: true,
      message: "you have added new product successfully",
      savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Serval Error",
      description: error,
    });
  }
});

export default router;
