import CartModel from "../models/cartModel.js";

export const createCartController = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "please send product id",
      });
    }

    console.log(`productId===> ${product}`);
    const user = req.user._id;
    console.log(`userID===> ${user}`);
    const existingCart = await CartModel.find({ product, user });
    console.log(existingCart);
    if (existingCart.length) {
      return res.status(200).send({
        success: false,
        message: "Product Already Added to Cart",
      });
    } else {
      const cart = await new CartModel({
        product,
        user,
      }).save();
      res.status(201).send({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in cart",
    });
  }
};

//update cart
export const updateCartController = async (req, res) => {
  try {
    const { qtyIncDec } = req.body;
    const { id } = req.params;
    const existingCart = await CartModel.findOne({ _id: id });
    console.log("existing cart", existingCart);
    if (qtyIncDec) {
      existingCart.quantity = existingCart.quantity + 1;
    } else {
      existingCart.quantity = existingCart.quantity - 1;
    }
    // console.log("existing after cart", existingCart.quantity, "  price", price);
    const cart = await CartModel.findByIdAndUpdate(
      id,
      { quantity: existingCart.quantity },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Product updated to cart.",
      cart,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: "error while updating cart",
      e,
    });
  }
};

// get cart
export const getUserCartController = async (req, res) => {
  console.log(`in user controller ${req.user._id}`);
  try {
    const cart = await CartModel.find({ user: req.user._id }).populate(
      "product"
    );
    console.log(cart);
    let totalPrice = 0;
    cart.map((e) => {
      totalPrice += e.product.price * e.quantity;
    });
    console.log(totalPrice);
    res.status(200).send({
      success: true,
      message: "Get user cart",
      cart,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting cart",
    });
  }
};

//delete cart
export const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await CartModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Cart Deleted Successfully",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting cart",
      error,
    });
  }
};
