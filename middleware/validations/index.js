import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import commonUtils from "../../utils/commonUtils.js";
import { AppString, userTokenRole } from "../../utils/appString.js";
import Joi from "joi";
import User from "../../components/user/models/userModel.js";
import tokenService from "../../auth/index.js";

async function _verifyJwtToken(token, role) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      { audience: role },
      async (error, payload) => {
        if (error) {
          if (error.name == "JsonWebTokenError") {
            reject(AppString.INVALID_TOKEN);
          }
          if (error.name == "TokenExpiredError") {
            reject(AppString.TOKEN_EXPIRE);
          }
          reject(AppString.INVALID_SESSION);
        } else {
          resolve(payload);
        }
      }
    );
  });
}

async function verifyAccessToken(req, res, next) {
  let authHeader = req.headers?.authorization ?? "";

  return _verifyUserToken(authHeader, userTokenRole.accessToken)
    .then((decodedPayload) => {
      res.locals.payload = decodedPayload;
      next();
    })
    .catch((err) => {
      return commonUtils.sendError(
        req,
        res,
        { message: err },
        httpStatus.UNAUTHORIZED
      );
    });
}
async function verifyRefreshToken(req, res, next) {
  let authHeader = req.headers?.authorization ?? "";
  return _verifyUserToken(authHeader, userTokenRole.refreshToken)
    .then((decodedPayload) => {
      res.locals.payload = decodedPayload;
      next();
    })
    .catch((err) => {
      return commonUtils.sendError(
        req,
        res,
        { message: err },
        httpStatus.UNAUTHORIZED
      );
    });
}

async function verifyAdminAccessToken(req, res, next) {
  let tokens = req.headers?.authorization?.split(" ") ?? [];
  if (tokens.length <= 1) {
    return commonUtils.sendError(
      req,
      res,
      { message: AppString.INVALID_TOKEN },
      httpStatus.UNAUTHORIZED
    );
  }
  let token = tokens[1];
  return _verifyJwtToken(token, userTokenRole.adminAccessToken)
    .then(async (encPayload) => {
      let decrypt = tokenService.decryptPayload(encPayload.sub);
      let data = decrypt.data.data;
      let user = await User.findOne({ email: data.email });
      if (user) {
        if (user.role == "admin") {
          req.user = user;
          next();
        }
        return commonUtils.sendError(
          req,
          res,
          { message: AppString.USER_IS_NOT_AUTHORIZED },
          httpStatus.UNAUTHORIZED
        );
      }
      return commonUtils.sendError(
        req,
        res,
        { message: AppString.USER_IS_NOT_AUTHORIZED },
        httpStatus.UNAUTHORIZED
      );
    })
    .catch((e) => {
      return commonUtils.sendError(
        req,
        res,
        { message: e },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    });
}
async function verifyAuthToken(req, res, next) {
  let tokens = req.headers?.authorization?.split(" ") ?? [];
  if (tokens.length <= 1) {
    return commonUtils.sendError(
      req,
      res,
      { message: AppString.INVALID_TOKEN },
      httpStatus.UNAUTHORIZED
    );
  }
  let token = tokens[1];
  try {
    let encPayload = await _verifyJwtToken(token, [
      userTokenRole.resetPassToken,
    ]);
    let decrypted = tokenService.decryptPayload(encPayload.sub);
    let data = decrypted.data;
    let user = await User.findOne({ email: data.data.email });
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    return commonUtils.sendError(
      req,
      res,
      { message: error },
      httpStatus.UNAUTHORIZED
    );
  }
}
const validate = (schema) => (req, res, next) => {
  const validSchema = commonUtils.pick(schema, ["query", "params", "body"]);
  const object = commonUtils.pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema).validate(object, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    const errorMessage = error.details[0].message;
    return commonUtils.sendError(
      req,
      res,
      { message: errorMessage },
      httpStatus.BAD_REQUEST
    );
  }
  Object.assign(req, value);
  return next();
};

export default {
  verifyAccessToken,
  verifyRefreshToken,
  verifyAuthToken,
  validate,
  verifyAdminAccessToken,
};
