import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
          },
        },
      ],
      required: true,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "Seller",
    },
    payment: {
      type: String,
      default: "Cash On Delivey",
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
    deliveryAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
