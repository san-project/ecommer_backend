import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import userModel from "../models/userModel.js";
const router = express.Router();

// get dashboard
router.get("/dashboard", verifyAdmin, async (req, res) => {
  const noOfProducts = await Product.find().estimatedDocumentCount();
  const noOfUsers = await userModel.find().estimatedDocumentCount();
  const sellers = await Seller.find({
    isAdmin: false,
  });
  const noOfApprovedSellers = sellers.filter((item) => {
    return item.isApproved === true;
  }).length;
  const noOfNotApprovedSellers = sellers.filter((item) => {
    return item.isApproved === false;
  }).length;
  console.log(noOfApprovedSellers);
  res.json({
    noOfProducts,
    noOfSeller: sellers.length,
    noOfApprovedSellers,
    noOfNotApprovedSellers,
    noOfUsers,
  });
});

//ioushydgy389q475603

export default router;
