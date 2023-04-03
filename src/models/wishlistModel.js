import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
