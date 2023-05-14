import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    minLength: [8, "Password must be at least 8 character required !"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      createAt: Date,
      title: String,
      description: String,
      completed: Boolean,
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },

  otp: Number,
  otp_expiry: Date,
});

// password bcript
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// user password compare

userSchema.methods.isMatchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// create jwt token
userSchema.methods.getJWTToken = function () {
  // console.log(process.env.JWT_COOKIE_EXPIRY);
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000,
  });
};

export default mongoose.model("User", userSchema);
