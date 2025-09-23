import User from "../model/User.js";

const logoutController = async (req, res) => {
  const cookies = req.cookies;
  //check if cookies exist
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.sendStatus(204);
    console.log(`refresh token succesfully cleared!: ${result}`);
  } catch (error) {
    console.error("error in logout controller:", error);
    res.status(500).json({ message: "internal server error!" });
  }
};

export default logoutController;
