import Users from "../models/userModel.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcryptjs";

// user registeration function with token and cookie send otp code
export const register = async (req, res) => {
  try {
    const { name, email } = req.body;

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

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    // console.log(password);

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
      otp_expiry: new Date(
        Date.now() + process.env.OTP_EXPIRY * 60 * 60 * 1000
      ),
    });

    // send otp code in user email
    // await sendMail(email, "Varify your account", `Your otp is ${otp}`);
    // send token
    sendToken(
      res,
      user,
      200,
      "OTP send your email, please verify your account"
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// verify token with otp code and user login
export const verify = async (req, res) => {
  try {
    // get otp code from user
    const otp = Number(req.body.otp);
    // get user id auth token from user middleware isAuth
    const user = await Users.findById(req.user._id);

    // check otp code
    if (otp !== user.otp || user.otp_expiry < Date.now()) {
      return res.status(400).json({
        status: false,
        message: "OTP is not correct",
      });
    }

    user.verified = true;
    user.otp_expiry = null;
    user.otp = null;

    console.log(user);
    await user.save();

    console.log(otp);
    sendToken(res, user, 200, "User is Verified");
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      messages: error,
      text: "User is not verified and cannot be saved",
    });
  }
};
// login user with set cookie
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "please provide email and password",
      });
    }

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    // compara  user password
    const isMatch = await user.isMatchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Email & Password is incorrect",
      });
    }

    sendToken(res, user, 200, "User logged in successfully");
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// logout function with cookie null value
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        status: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// add tasks function
export const addTasks = async (req, res) => {
  try {
    const { title, description } = req.body;

    // "req.user._id" get value in isAuthorized middleware

    const user = await Users.findById(req.user._id);

    user.tasks.push({
      title,
      description,
      completed: false,
      createAt: new Date(Date.now()),
    });

    await user.save();

    sendToken(res, user, 200, "User Tasks added successfully");
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
// remove tasks function
export const removeTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = await Users.findById(req.user._id);
    //
    user.tasks = user.tasks.filter((task) => task._id != taskId);

    // console.log(user.tasks);

    await user.save();

    sendToken(res, user, 200, "User Tasks removed successfully");
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
// update task function
export const updateTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = await Users.findById(req.user._id);

    user.task = user.tasks.find((task) => task._id == taskId);

    // console.log(!user.task.completed);
    user.task.completed = !user.task.completed;

    await user.save();

    res
      .status(200)
      .json({ status: true, message: " Task updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
