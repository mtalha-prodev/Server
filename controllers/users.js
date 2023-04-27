import Users from "../models/userModel.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";

// user registeration fuction
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // get user pic
    // const { avatar } = req.files;

    let user = await Users.findOne({ email });

    // chack user already exist or not
    if (user) {
      return res.status(400).json({
        status: false,
        message: "User Already Exist",
      });
    }

    // create otp 6 number
    const otp = Math.floor(Math.random() * 1000000);

    // create user detail in database
    user = await Users.create({
      name,
      email,
      password,
      avatar: {
        public_id: "",
        url: "",
      },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 1000),
    });

    // send otp code in user email
    await sendMail(email, "Varify your account", `Your otp is ${otp}`);
    // send token
    sendToken(
      res,
      user,
      200,
      "OTP send your email, please varify your account"
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
