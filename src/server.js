import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

//files
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import wishlistRoute from "./routes/wishListProduct.js";

dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.error(`error====>${e}`);
  });

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const hostName = "0.0.0.0";

app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);

app.listen(process.env.PORT || 5000, hostName, () => {
  console.log("listening at 5000");
});
