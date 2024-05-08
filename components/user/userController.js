import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppString } from "../../utils/appString.js";
import commonUtils from "../../utils/commonUtils.js";
import userService from "./services.js";
import tokenService from "../../auth/index.js";
import eventEmitter from "../../utils/event.js";
import productService from "../product/services.js";
import mongoose from "mongoose";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user) {
      return commonUtils.sendError(
        req,
        res,
        { success: false, message: AppString.USER_ALREADY_EXIST },
        httpStatus.CONFLICT
      );
    }
    let newUser = await userService.createUser({
      email: email,
      password: password,
    });
    return commonUtils.sendSuccess(
      req,
      res,
      { success: true, message: AppString.USER_CREATED, newUser },
      httpStatus.OK
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.INVALID_PASS },
      httpStatus.FORBIDDEN
    );
  }
  let tokens = await tokenService.generateUserAccessToken({
    _id: user._id,
    email: email,
  });
  user.refreshToken = tokens.refreshToken;
  await user.save();
  if (
    user.isProfileCompleted == "not-Completed" ||
    user.isProfileCompleted == "step-1"
  ) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.PROFILE_INCOMPLETED },
      httpStatus.UNAUTHORIZED
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, token: tokens.accessToken },
    httpStatus.OK
  );
  } catch (error) {
      return commonUtils.sendError(req, res, { success: false, error: AppString.SOMETHING_WENT_WRONG }, httpStatus.INTERNAL_SERVER_ERROR)
  }
};

const postProfile = async (req, res) => {
  const userBody = req.body;
  try {
    const user = await userService.getUserById(req.user._id);
    if (user) {
      await userService.postUser(user._id, userBody, "step-1");
      return commonUtils.sendSuccess(
        req,
        res,
        { success: true, message: AppString.PROFILE_STEP_1 },
        httpStatus.OK
      );
    }
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const addSecret = async (req, res) => {
  try {
    const exist = await userService.getUserById(req.user._id);
    if (exist) {
      const user = await userService.postUser(exist._id, req.body, "completed");
      return commonUtils.sendSuccess(
        req,
        res,
        { success: true, message: AppString.PROFILE_COMPLETED },
        httpStatus.OK
      );
    }
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const checkStatus = async (req, res) => {
  try {
    const exist = await userService.getFullUserById(req.user._id);
    if (exist) {
      let message = "";
      if (exist.isProfileCompleted == "not-Completed") {
        message = AppString.PROFILE_INCOMPLETED;
      } else if (exist.isProfileCompleted == "step-1") {
        message = AppString.PROFILE_STEP_1;
      } else message = AppString.PROFILE_COMPLETED;
      return commonUtils.sendSuccess(
        req,
        res,
        { success: true, message: message },
        httpStatus.OK
      );
    }
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const sendOtp = async (req, res) => {
  try {
    let exist = await userService.getUserById(req.user._id);
    if (exist) {
      let otp = commonUtils.generateOtp();
      let subject = `Reset your password by verification code`;
      let to = req.body.email;
      let text = "Your email verified Succesfully";
      let data = {
        user: req.user._id,
        otp: otp,
      };
      let existOtp = await userService.getOtp(req.user._id);
      if (existOtp) {
        await userService.deleteOtp(req.user._id);
      }
      await userService.createOtp(data);
      sendEmail({ to, subject, text, otp });
      return commonUtils.sendSuccess(
        req,
        res,
        { success: true, message: AppString.OTP_SENT },
        httpStatus.OK
      );
    }
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
const sendEmail = (to, subject, text, otp) => {
  try {
    eventEmitter.emit("send-pass-with-mail", {
      to: to,
      subject: subject,
      text: text,
      otp: otp,
    });
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const verifyOtp = async (req, res) => {
  try {
    let otp = req.body.otp;
    let id = req.user._id;
    let exist = await userService.getUserById(req.user._id);
    if (exist) {
      let otpExist = await userService.getOtp(id);
      if (otpExist) {
        if (otpExist.otp === otp) {
          return commonUtils.sendSuccess(
            req,
            res,
            { success: true, message: AppString.OTP_VERIFIED },
            httpStatus.OK
          );
        }
        return commonUtils.sendError(
          req,
          res,
          { success: false, message: AppString.OTP_NOT_MATCHED },
          httpStatus.FORBIDDEN
        );
      }
      return commonUtils.sendError(
        req,
        res,
        { success: false, message: AppString.OTP_EXPIRED },
        httpStatus.FORBIDDEN
      );
    }
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    let { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return commonUtils.sendError(
        req,
        res,
        { success: false, message: AppString.PASS_NOT_MATCHED },
        httpStatus.BAD_REQUEST
      );
    }
    let exist = await userService.getUserById(req.user._id);
    if (!exist) {
      return commonUtils.sendError(
        req,
        res,
        { success: false, message: AppString.USER_NOT_EXIST },
        httpStatus.NOT_FOUND
      );
    }
    let update = await userService.updateUser(exist._id, {
      password: password,
    });
    if (update) {
      return commonUtils.sendSuccess(
        req,
        res,
        { success: true, message: AppString.PASS_UPDATED },
        httpStatus.OK
      );
    }
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, error: AppString.SOMETHING_WENT_WRONG },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllUser = async (req, res) => {
  // query : page limit sort
  const { page, limit } = req.query;
  let exist = await userService.getUserById(req.user._id);
  if (!exist) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  let users = await userService.getAllUser(req.user._id, { page, limit });
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_RETRIEVED, users },
    httpStatus.OK
  );
};
const getUser = async (req, res) => {
  //params : id
  const { id } = req.params;
  let admin = await userService.getUserById(req.user._id);
  if (!admin) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.ADMIN_NOT_FOUND },
      httpStatus.NOT_FOUND
    );
  }
  let user = await userService.getFullUserById(id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_RETRIEVED, user },
    httpStatus.OK
  );
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  let admin = await userService.getUserById(req.user._id);
  if (!admin) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.ADMIN_NOT_FOUND },
      httpStatus.NOT_FOUND
    );
  }
  let user = await userService.getUserById(id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  await userService.deleteUser(id);
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_DELETED },
    httpStatus.OK
  );
};

const deleteProfile = async (req, res) => {
  let user = await userService.getUserById(req.user._id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  await userService.deleteUser(req.user._id);
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_DELETED },
    httpStatus.OK
  );
};
const getProfile = async (req, res) => {
  let user = await userService.getFullUserById(req.user._id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_RETRIEVED, user },
    httpStatus.OK
  );
};
const updateProfile = async (req, res) => {
  let exist = await userService.getUserById(req.user._id);
  if (!exist) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  let updated = await userService.updateUser(req.user._id, req.body);
  if (!updated) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_ALREADY_EXIST },
      httpStatus.CONFLICT
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.USER_UPDATED },
    httpStatus.OK
  );
};

const getAllWishList = async (req, res) => {
  const { page, limit } = req.query;
  let user = await userService.getUserById(req.user._id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  let products = [];
  let length = user.wishList.length;
  for (let i = 0; i < length; i++) {
    let matchCriteria2 = {
      _id: new mongoose.Types.ObjectId(user.wishList[i]),
    };
    let product = await productService.getAllProd({
      matchCriteria2,
      page,
      limit,
    });
    if (product) products.push(product[0]);
  }
  if (products == []) {
    return commonUtils.sendError(
      req,
      res,
      { success: true, message: AppString.PRODUCT_NOT_AVAILABLE_WISH },
      httpStatus.OK
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.PRODUCT_RETRIEVED, products },
    httpStatus.OK
  );
};
const getCatWishList = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  let user = await userService.getUserById(req.user._id);
  if (!user) {
    return commonUtils.sendError(
      req,
      res,
      { success: false, message: AppString.USER_NOT_EXIST },
      httpStatus.NOT_FOUND
    );
  }
  const matchCriteria1 = { category: new mongoose.Types.ObjectId(id) };
  let products = [];
  let length = user.wishList.length;
  for (let i = 0; i < length; i++) {
    let matchCriteria2 = {
      _id: new mongoose.Types.ObjectId(user.wishList[i]),
    };
    let product = await productService.getAllProd({
      matchCriteria1,
      matchCriteria2,
      page,
      limit,
    });
    if (product) products.push(product[0]);
  }
  if (products == []) {
    return commonUtils.sendError(
      req,
      res,
      { success: true, message: AppString.PRODUCT_NOT_AVAILABLE_WISH },
      httpStatus.OK
    );
  }
  return commonUtils.sendSuccess(
    req,
    res,
    { success: true, message: AppString.PRODUCT_RETRIEVED, products },
    httpStatus.OK
  );
};
export default {
  register,
  login,
  postProfile,
  addSecret,
  checkStatus,
  sendOtp,
  verifyOtp,
  resetPassword,
  getAllUser,
  getUser,
  getProfile,
  updateProfile,
  deleteUser,
  deleteProfile,
  getAllWishList,
  getCatWishList,
};
