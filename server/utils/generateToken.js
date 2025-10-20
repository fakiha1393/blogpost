import jwt from "jsonwebtoken";

// A token is meant for keeping a user logged in for a specific time
export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  }); //sign function helps generating token
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({
        success:true,
        message,
        user
    });
};
