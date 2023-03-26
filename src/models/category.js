import mongoose from "mongoose";

const categoryScheme = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  subCategory: String,
});

const Category = mongoose.model("Category", categoryScheme);
export default Category;
