import express from "express";
import { verifySeller } from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductsOfSeller,
  getSingleProduct,
  uploadProduct,
  getProductsOfCategory,
} from "../controller/productController.js";
const router = express.Router();

router.get("/sellerProducts", getProductsOfSeller);
router.get("/categoryproducts", getProductsOfCategory);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.post("/", verifySeller, uploadProduct);
export default router;
