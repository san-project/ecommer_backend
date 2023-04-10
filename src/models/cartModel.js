/*
import mongoose from "mongoose";
const CartModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);
const Wishlist = mongoose.model("Cart", CartModel);
export default Wishlist;
*/
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
