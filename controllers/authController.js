import validator from "validator";

import getJwtToken from "../utils/token";
import User from "../models/user/User";
import { formatDbError, isEmptyFields } from "../utils/errorUtils";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;
  const userData = { userName, email, password };
  if (isEmptyFields(userData)) {
    return res.status(400).json({ err: "All fields are mandatory!" });
  }

  if (!validator.isEmail(email) || password.length < 6) {
    return res.status(400).json({ err: "Either email/password is not valid" });
  }

  try {
    const userdoc = await User.create(userData);

    const accessToken = await getJwtToken(
      userdoc,
      process.env.JWT_ACCESS_SECRET || "",
      "10m"
    );
    const refreshToken = await getJwtToken(
      userdoc,
      process.env.JWT_REFRESH_SECRET || "",
      "1d"
    );

    const user = await User.addRefreshToken(userdoc._id, refreshToken);

    return res.status(200).json({ user, accessToken });
  } catch (error) {
    return res.status(400).json({ err: formatDbError(error) });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const userData = { email, password };

  if (isEmptyFields(userData)) {
    return res.status(400).json({ err: "All fields are mandatory!" });
  }

  if (!validator.isEmail(email) || password.length < 6) {
    return res.status(400).json({ err: "Either email/password is not valid" });
  }

  try {
    const userdoc = await User.login(email, password);

    // For generating tokens
    const accessToken = await getJwtToken(
      userdoc,
      process.env.JWT_ACCESS_SECRET || "",
      "10m"
    );
    const refreshToken = await getJwtToken(
      userdoc,
      process.env.JWT_REFRESH_SECRET || "",
      "1d"
    );

    const user = await User.addRefreshToken(userdoc._id, refreshToken);

    return res.status(200).json({
      user,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(400).json({ err: formatDbError(error) });
  }
};
