import jwt from "jsonwebtoken";
import aes from "../utils/aes.js";
import { userTokenRole } from "../utils/appString.js";

const _generateAccessToken = (payload, role) => {
  return jwt.sign(
    { sub: payload },
    process.env.JWT_SECRET,
    { audience: role },
    { expiresIn: process.env.ACCESS_TIME }
  );
};

const _generateRefreshToken = (payload) => {
  return jwt.sign(
    { sub: payload },
    process.env.JWT_SECRET,
    { audience: userTokenRole.refreshToken },
    { expiresIn: process.env.REFRESH_TIME }
  );
};

const encryptPayload = (data) => {
  //object of data
  let encData = aes.encrypt(JSON.stringify(data), process.env.OUT_KEY_DATA); //string from object
  let payload = aes.encrypt(encData, process.env.OUT_KEY_PAYLOAD);
  return {
    data: encData,
    payload: payload,
  };
};
const decryptPayload = (payload) => {
  let decPayload = aes.decrypt(payload, process.env.OUT_KEY_PAYLOAD);
  let data = aes.decrypt(decPayload, process.env.OUT_KEY_DATA);
  return {
    data: JSON.parse(data), //object from string
    payload: decPayload,
  };
};

const generateUserAccessToken = async (data) => {
  //in object
  let encryptPayload = encryptPayload({
    data,
    type: userTokenRole.accessToken,
  });
  const accessToken = _generateAccessToken(
    encryptPayload.payload,
    userTokenRole.accessToken
  );
  const refreshToken = _generateRefreshToken(encryptPayload.payload);

  let token = { accessToken, refreshToken };
  return token;
};

export default {
  generateUserAccessToken,
  decryptPayload,
};
