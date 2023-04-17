import { comparePassword, hashPassword } from "../../helpers/authHelper.js";
import Seller from "../../models/sellerModel.js";
import JWT from "jsonwebtoken";

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "please enter all fields",
      });
    }
    const seller = await Seller.findOne({ email });
    if (!seller) {
      console.log("Not Found");
      return res.status(401).json({
        status: false,
        message: "User Not Found",
      });
    }
    const match = await comparePassword(password, seller.password);
    if (!seller.isApproved) {
      return res.status(403).json({
        status: false,
        message:
          "You have not been approved to login, please wait until you will get approved",
      });
    }

    if (!match) {
      return res.status(401).json({
        status: false,
        message: "Invalid Credentials",
      });
    }
    const token = JWT.sign(
      {
        _id: seller._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 30,
      }
    );
    return res.status(200).json({
      status: true,
      id: seller._id,
      name: seller.name,
      businessName: seller.businessName,
      isApproved: seller.isApproved,
      isAdmin: seller.isAdmin,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Serval Error",
      description: error,
    });
  }
};

export const sellerRegister = async (req, res) => {
  const { name, email, password, businessName, address, mobile, gstNo } =
    req.body;
  console.log(req.body);
  if (
    !name ||
    !email ||
    !password ||
    !businessName ||
    !address ||
    !mobile ||
    !gstNo
  ) {
    return res.status(400).json({
      status: false,
      message: "please enter all fields",
    });
  } else {
    try {
      const isExistingSeller =
        (await Seller.findOne({ email: email })) ||
        (await Seller.findOne({ mobile }));
      if (isExistingSeller) {
        return res.status(409).json({
          status: false,
          message: "Seller already found with same email or mobile number",
        });
      }
      const hashedPassword = await hashPassword(password);
      const newSeller = new Seller({
        name,
        password: hashedPassword,
        email,
        address,
        businessName,
        mobile,
        gstNo,
      });
      await newSeller.save();
      const token = JWT.sign(
        {
          _id: newSeller._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 60 * 60 * 24 * 30,
        }
      );
      res.status(201).json({
        status: true,
        message:
          "You have been registered successfully please wait until you've been approved",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Serval Error",
        description: error,
      });
    }
  }
};
