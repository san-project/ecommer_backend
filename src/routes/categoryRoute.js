import express from "express";
import { verifySeller } from "../middleware/authMiddleware.js";
import Category from "../models/category.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json(allCategories);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

router.post("/", verifySeller, async (req, res) => {
  const { category, subCategory } = req.body;
  if (!category) {
    return res.status(400).json({
      message: "enter category",
    });
  }
  try {
    const newCategory = new Category({
      category,
      subCategory,
    });
    await newCategory.save();
    res.status(200).json({
      success: true,
      message: "new category added",
      ...newCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

export default router;
