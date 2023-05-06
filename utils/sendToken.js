export const sendToken = async (res, user, statusCode, message) => {
  try {
    // get token in user model
    const token = user.getJWTToken();

    // options in expires token cookie
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
      ),
    };

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      tasks: user.tasks,
      verified: user.verified,
    };

    // console.log(token);
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ status: true, message, user: userData });
  } catch (error) {
    res.status(401).json({ status: false, message: error.message });
  }
};
