import { sign, verify } from "jsonwebtoken";

const createToken = (user, jwtSecret, expireTime) => {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      password: user.password,
      resetLink: user.resetLink,
    };
    const options = {
      expiresIn: expireTime,
      issuer: "react-news",
      // audience: userId,
    };
    sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        console.log("Error while signing token: ", err.message);
        reject(err);
      }
      resolve(token);
    });
  });
};

export const verifyRefreshToken = (refreshToken, secret) => {
  return new Promise((resolve, reject) => {
    verify(refreshToken, secret, (err, payload) => {
      if (err) reject(err);
      resolve(payload);
    });
  });
};

export default createToken;
