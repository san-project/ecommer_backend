import express from "express";

import {
  sellerLogin,
  sellerRegister,
} from "../controller/authControllers/sellerController.js";
import {
  userLogin,
  userRegister,
} from "../controller/authControllers/userController.js";
const router = express.Router();

//seller
router.post("/seller/register", sellerRegister);

router.post("/seller/login", sellerLogin);

//USER
router.post("/user/register", userRegister);

router.post("/user/login", userLogin);

export default router;
