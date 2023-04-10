import Product from "../models/productModel.js";
import { uploadFiles } from "../helpers/cloudinaryConfig.js";
import { v2 as cloudinary } from "cloudinary";
import Wishlist from "../models/wishlistModel.js";
import JWT from "jsonwebtoken";
export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(401).json({
      message: "pass product id in params",
    });
  }
  try {
    const product = await Product.findById(id)
      .populate("category")
      .populate("seller", "businessName");
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Serval Error",
      description: error,
    });
  }
};

export const getAllProducts = async (req, res) => {
  console.log("all products");
  const authHeader = req.headers.authorization;
  console.log(`header==============================${authHeader}`);
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decode = JWT.verify(token, process.env.JWT_SECRET);
      const userId = decode.id;
      const products = await Product.find()
        .populate("category")
        .populate("seller", "businessName");
      const wishlist = await Wishlist.findOne({ userId }).populate("products");
      // iterate over the products and check if each product is in the wishlist
      const result = products.map((product) => {
        const inWishlist = wishlist.products.some(
          (wishlistProduct) =>
            wishlistProduct._id.toString() === product._id.toString()
        );
        return {
          ...product.toObject(),
          inWishlist,
        };
      });
      return res.status(200).json({
        success: true,
        products: result,
      });
    }
    const products = await Product.find()
      .populate("category")
      .populate("seller", "businessName");
    console.log(products);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Internal Serval Error, cannot get products",
      description: error,
    });
  }
};

export const getProductsOfSeller = async (req, res) => {
  console.log("products of seller");
  try {
    const sellerId = req.query.sellerId;
    console.log(`sellerId => ${sellerId}`);
    if (!sellerId) {
      return res.status(401).json({
        status: false,
        message: "please enter seller id",
      });
    }
    const sellerProducts = await Product.find({
      seller: sellerId,
    });
    res.status(200).json({
      status: true,
      products: sellerProducts,
    });
  } catch (error) {
    console.log(`error => ${error}`);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const uploadProduct = async (req, res) => {
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
        publicId: thumbnailUrl.public_id,
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
};
