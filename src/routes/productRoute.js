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
  deleteImage,
} from "../controller/productController.js";
const router = express.Router();

router.get("/sellerProducts", getProductsOfSeller);
router.get("/categoryproducts", getProductsOfCategory);
router.get("/search", getProductsFromQuery);
router.post("/order", verifyToken, sendOrder);
router.delete("/image", verifySeller, deleteImage);

router.get("/", getAllProducts);
router.post("/", verifySeller, uploadProduct);
router.get("/:id", getSingleProduct);

export default router;
