import express from "express";
import { verifyAdmin, verifySeller } from "../middleware/authMiddleware.js";
import Seller from "../models/sellerModel.js";
import orderModel from "../models/orderModel.js";
import Product from "../models/productModel.js";
const router = express.Router();
router.get("/", verifyAdmin, async (req, res) => {
  const sellers = await Seller.find({ isAdmin: false });
  res.json(sellers);
});
router.get("/dashboard", verifySeller, async (req, res) => {
  const orders = await orderModel.find({
    seller: req.seller._id,
  });
  const products = await Product.find({ seller: req.seller._id });
  const allProducts = products.length;
  const allOrders = orders.length;
  const notProcessedOrders = orders.filter((item) => {
    console.log(item.status);
    return item.status === "Not Process";
  }).length;
  const deliveredOrders = orders.filter((item) => {
    return item.status == "Delivered";
  }).length;

  console.log(notProcessedOrders);
  const cancelledOrders = orders.filter((item) => {
    return item.status == "Canceled";
  }).length;
  res.json({
    allOrders,
    deliveredOrders,
    notProcessedOrders,
    cancelledOrders,
    allProducts,
  });
});
router.get("/verified", async (req, res) => {
  const sellers = await Seller.find({ isApproved: true });
  res.json(sellers);
});
router.get("/not-verified", async (req, res) => {
  const sellers = await Seller.find({ isApproved: false });
  res.json(sellers);
});
router.get("/my-profile", verifySeller, async (req, res) => {
  res.json({ seller: req.seller });
});

router.get("/orders", verifySeller, async (req, res) => {
  const allOrders = await orderModel
    .find({ seller: req.seller._id })
    .populate({
      path: "products",
      populate: [
        {
          path: "product",
        },
      ],
    })
    .populate("buyer");
  res.status(200).json({
    orders: allOrders,
  });
});

router.get("/orders/:id", async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({
      path: "products",
      populate: [
        {
          path: "product",
        },
      ],
    })
    .populate("buyer");

  if (!order) {
    return res.status(401).json({
      message: "Did not find order",
    });
  }

  return res.status(200).json({
    success: true,
    order,
  });
});
router.put("/orders/:id", async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  const { status } = req.body;
  if (!order) {
    return res.status(401).json({
      message: "Did not find order",
    });
  }
  const updatedOrder = await orderModel
    .findByIdAndUpdate(req.params.id, {
      status,
    })
    .populate({
      path: "products",
      populate: [
        {
          path: "product",
        },
      ],
    })
    .populate("buyer");
  if (status != "Canceled") {
    order.products.forEach((pid) => {
      Product.findByIdAndUpdate(pid, { $: { countInStock: -1 } });
    });
  }
  res.status(200).json({
    success: true,
    message: "Order Status updated successfully",
    updatedOrder,
  });
});

router.get("/:id", verifyAdmin, async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  res.json(seller);
});

router.put("/approve/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByIdAndUpdate(id, { isApproved: true });
    return res.status(201).json({
      success: true,
      message: `approved ${seller.name}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Serval Error",
      description: error,
    });
  }
});

export default router;
