import decryptData from "../middleware/Security/decryptData.js";
import encryptData from "../middleware/Security/encryptData.js";
import verifyToken from "../middleware/validations/index.js";

const sendSuccess = (req, res, data, statusCode) => {
  // let encrypted = encryptData.EncryptData(req, res, data);
  res.status(statusCode).send(data);
};

const sendError = (req, res, data, statusCode) => {
  res.status(statusCode).send(data);
};

const generateOtp = () => {
  return Number(Math.random() * (9999 - 1000) + 1000).toFixed();
};
const routeArray = (array_, router) => {
  array_.forEach((route) => {
    const path = route.path;
    const method = route.method;
    const validation = route.validation;
    const controller = route.controller;
    let middlewares = [];
    const isEncrypt = route.isEncrypt === undefined ? true : route.isEncrypt;
    const isPublic = route.isPublic === undefined ? false : route.isPublic;
    const isAdmin = route.isAdmin === undefined ? false : route.isAdmin;
    if (isEncrypt) {
      middlewares.push(decryptData.DecryptData);
    }
    if (!isPublic) {
      if (isAdmin) {
        middlewares.push(
          route.authMiddleware ?? verifyToken.verifyAdminAccessToken
        );
      } else {
        middlewares.push(route.authMiddleware ?? verifyToken.verifyAuthToken);
      }
    }
    if (validation) {
      if (Array.isArray(validation)) {
        middlewares.push(...validation);
      } else {
        middlewares.push(validation);
      }
    }
    middlewares.push(controller);
    router[method](path, ...middlewares);
  });
  return router;
};

const pick = (object, keys) => {
  //schema and array
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
export default {
  sendSuccess,
  sendError,
  routeArray,
  pick,
  generateOtp,
};
