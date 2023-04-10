import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createCartController,
  updateCartController,
  getUserCartController,
  deleteCartController,
} from "../controller/cartController.js";
const router = express.Router();

//create cart
router.post("/", verifyToken, createCartController);

//update cart
router.put("/:id", verifyToken, updateCartController);

//update cart for size
//get cart
router.get("/", verifyToken, getUserCartController);

//delete cart
router.delete("/:id", verifyToken, deleteCartController);

export default router;
