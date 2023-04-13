import { mongoose } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    profile: {
      type: {},
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
