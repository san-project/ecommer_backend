import mongoose from "mongoose";

const UserOtpVerificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

const UserOtpVerificationModel = mongoose.model(
  "UserOtpVerification",
  UserOtpVerificationSchema
);

export default UserOtpVerificationModel;
