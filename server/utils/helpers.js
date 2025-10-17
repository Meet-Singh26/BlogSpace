import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../models/User.js";

export const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  });

  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 5);
  }

  return username;
};
