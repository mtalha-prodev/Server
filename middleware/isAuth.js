import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    // get cookie value
    const { token } = req.cookies;
    // check if token is
    if (!token) {
      res.status(401).json({
        status: false,
        message: "not logged in",
      });
    }
    // decode token verifier in jwt
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // set value in user auth request
    req.user = await Users.findById(decode._id);

    next();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
