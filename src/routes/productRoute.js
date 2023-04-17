import express from "express";
import { verifySeller, verifyToken } from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductsOfSeller,
  getSingleProduct,
  uploadProduct,
  getProductsOfCategory,
  getProductsFromQuery,
  sendOrder,
} from "../controller/productController.js";
const router = express.Router();

router.get("/sellerProducts", getProductsOfSeller);
router.get("/categoryproducts", getProductsOfCategory);
router.get("/search", getProductsFromQuery);
router.post("/order", verifyToken, sendOrder);
router.get("/:id", getSingleProduct);
router.get("/", getAllProducts);
router.post("/", verifySeller, uploadProduct);

export default router;
