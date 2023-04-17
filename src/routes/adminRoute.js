import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
const router = express.Router();

// get dashboard
router.get("/dashboard", verifyAdmin, async (req, res) => {
  const noOfProducts = await Product.find().estimatedDocumentCount();
  const noOfUsers = await userModel.find().estimatedDocumentCount();
  const sellers = await Seller.find({
    isAdmin: false,
  });
  const totalOrders = await orderModel.find();
  const noOfApprovedSellers = sellers.filter((item) => {
    return item.isApproved === true;
  }).length;
  const noOfNotApprovedSellers = sellers.filter((item) => {
    return item.isApproved === false;
  }).length;
  const noOfdeliveredOrders = totalOrders.filter((item) => {
    return item.status == "Delivered";
  }).length;
  console.log(noOfApprovedSellers);
  return res.status(200).json({
    noOfProducts,
    noOfSeller: sellers.length,
    noOfApprovedSellers,
    noOfNotApprovedSellers,
    noOfUsers,
    noOfdeliveredOrders,
    totalOrders: totalOrders.length,
  });
});

//ioushydgy389q475603

export default router;
