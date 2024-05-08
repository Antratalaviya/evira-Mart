import bcrypt from "bcrypt";

import User from "./models/userModel.js";
import tokenService from "../../auth/index.js";
import Otp from "./models/otpSchema.js";

const getUserByEmail = (email) => {
  const query = {
    email,
  };
  const data = {
    password: 1,
    isProfileCompleted: 1,
  };
  return User.findOne(query, data);
};

const createUser = async (userBody) => {
  userBody.password = await bcrypt.hash(userBody.password, 10);
  let user = await User.create(userBody);
  const tokens = await tokenService.generateRegisterToken({
    _id: user._id,
    email: user.email,
  });
  user.refreshToken = tokens.refreshToken;
  await user.save();
  return {
    email: user.email,
    isProfileCompleted: user.isProfileCompleted,
    accessToken: tokens.accessToken,
  };
};

const getUserById = (_id) => {
  const query = {
    _id,
  };

  const data = {
    _id: 1,
    wishList: 1,
  };
  return User.findOne(query, data);
};

const getFullUserById = (_id) => {
  const query = {
    _id,
  };
  const data = {
    email: 1,
    fullname: 1,
    nickname: 1,
    dateOfBirth: 1,
    mobile: 1,
    gender: 1,
    isProfileCompleted: 1,
    wishList: 1,
  };
  return User.findOne(query, data);
};

const postUser = async (_id, userBody, isProfileCompleted) => {
  const query = {
    _id,
  };
  const data = {
    $set: {
      ...userBody,
      isProfileCompleted: isProfileCompleted,
    },
  };
  const option = {
    new: true,
  };
  return User.updateOne(query, data, option);
};
const deleteOtp = async (_id) => {
  const query = {
    user: _id,
  };
  return Otp.deleteOne(query);
};

const getOtp = async (_id) => {
  const query = {
    user: _id,
  };
  const data = {
    user: 1,
  };
  return Otp.findOne(query, data);
};
const createOtp = async (body) => {
  return Otp.create(body);
};
const updateUser = async (_id, userbody) => {
  const query = {
    _id,
  };
  if (userbody.email) {
    let exist = await User.findOne({
      $and: [{ email: userbody.email }, { _id: { $ne: _id } }],
    });
    if (exist) {
      return null;
    }
  }
  const data = {
    $set: {
      ...userbody,
    },
  };
  const option = {
    new: true,
  };
  return User.updateOne(query, data, option);
};

const getAllUser = (adminId, { page, limit }) => {
  page ||= 1;
  limit ||= 10;

  const query = {
    _id: { $ne: { _id: adminId } },
  };
  const data = {
    email: 1,
    fullname: 1,
    nickname: 1,
    dateOfBirth: 1,
    isProfileCompleted: 1,
    mobile: 1,
    gender: 1,
    wishList: 1,
  };
  return User.find(query, data)
    .skip((page - 1) * limit)
    .limit(limit);
};

const deleteUser = (_id) => {
  const query = {
    _id,
  };
  return User.deleteOne(query);
};
const addProdWishList = (prodId, userId) => {
  const query = {
    _id: userId,
  };
  const data = {
    $push: {
      wishList: prodId,
    },
  };
  const option = {
    new: true,
  };
  return User.updateOne(query, data, option);
};
const removeProdWishList = (prodId, userId) => {
  const query = {
    _id: userId,
  };
  const data = {
    $pull: {
      wishList: prodId,
    },
  };
  const option = {
    new: true,
  };
  return User.updateOne(query, data, option);
};

export default {
  getUserByEmail,
  createUser,
  getUserById,
  getFullUserById,
  postUser,
  deleteOtp,
  getOtp,
  createOtp,
  updateUser,
  getAllUser,
  deleteUser,
  addProdWishList,
  removeProdWishList,
};
