import express from "express";
import { verifyAdmin, verifySeller } from "../middleware/authMiddleware.js";
import Seller from "../models/sellerModel.js";
const router = express.Router();
router.get("/", verifyAdmin, async (req, res) => {
  const sellers = await Seller.find({ isAdmin: false });
  res.json(sellers);
});

router.get("/:id", verifySeller, async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  res.json(seller);
});

router.get("/verified", async (req, res) => {
  const sellers = await Seller.find({ isApproved: true });
  res.json(sellers);
});
router.get("/not-verified", async (req, res) => {
  const sellers = await Seller.find({ isApproved: false });
  res.json(sellers);
});

router.put("/approve/:id", async (req, res) => {
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
