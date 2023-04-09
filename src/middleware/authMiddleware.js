import JWT from "jsonwebtoken";
import Seller from "../models/sellerModel.js";

const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({
      message: "You are not authorized",
    });
  try {
    const token = authHeader.split(" ")[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Token is not valid",
    });
  }
};

export const verifySeller = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader)
    return res.status(401).json({
      message: "You are not authorized",
    });
  try {
    const token = authHeader.split(" ")[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const id = decode._id;
    const seller = await Seller.findById(id);
    if (seller.isApproved === true) {
      req.seller = decode;
      next();
    } else {
      return res.status(401).json({
        message: "You are not authorized please wait until you've been verfied",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Token is not valid",
    });
  }
};

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader)
    return res.status(401).json({
      message: "You are not authorized",
    });
  try {
    const token = authHeader.split(" ")[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const id = decode._id;
    const seller = await Seller.findById(id);
    console.log(seller);
    if (seller.isAdmin === true) {
      next();
    } else {
      return res.status(401).json({
        message: "You are not admin",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "Token is not valid",
    });
  }
};
