import JWT from "jsonwebtoken";

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
    if (decode.isApproved === true) {
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
// export const isAdmin = async (req, res, next) => {
//   try {
//     const seller = await userModel.findById(req.user._id);
//     if (user.role !== 1) {
//       return res.status(401).send({
//         success: false,
//         message: "UnAuthorized Access",
//       });
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({
//       success: false,
//       error,
//       message: "Error in admin middelware",
//     });
//   }
// };

// export const isSeller = async (req, res, next) => {
//   try {
//     const user = await userModel.findById(req.user._id);
//     if (user.role !== 2) {
//       return res.status(401).send({
//         success: false,
//         message: "UnAuthorized Access",
//       });
//     } else {
//       next();
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({
//       success: false,
//       error,
//       message: "Error in Seller middelware",
//     });
//   }
// };
