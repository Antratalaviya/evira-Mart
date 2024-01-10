import jwt from 'jsonwebtoken'
import aes from '../utils/aes.js'
import { userTokenRole } from '../utils/appString.js'

const _generateAccessToken = (payload, role) => {
    return jwt.sign({ sub: payload }, process.env.JWT_SECRET, { audience: role }, { expiresIn: process.env.ACCESS_TIME })
}

const _generateRefreshToken = (payload) => {
    return jwt.sign({ sub: payload }, process.env.JWT_SECRET, { audience: userTokenRole.refreshToken }, { expiresIn: process.env.REFRESH_TIME })
}

const encryptPayload = (data) => {  //object of data
    let encData =  aes.encrypt(JSON.stringify(data), process.env.OUT_KEY_DATA)
    let payload =  aes.encrypt(encData, process.env.OUT_KEY_PAYLOAD)
    return {
        data: encData,
        payload: payload
    }
}
const decryptPayload = (payload) => {
    let decPayload = aes.decrypt(payload, process.env.OUT_KEY_PAYLOAD)
    let data = aes.decrypt(decPayload, process.env.OUT_KEY_DATA)
    return {
        data: JSON.parse(data),
        payload: decPayload
    }
}

const generateUserAccessToken = (payload)=>{ //in object
    let encryptPayload = encryptPayload(payload)
    const accessToken = _generateAccessToken(encryptPayload.payload,userTokenRole.accessToken)
    const refreshToken = _generateRefreshToken(encryptPayload.payload)

    let data = { accessToken, refreshToken}
    return data;
} 

const generateRegisterToken = async(data)=>{  // string
    let encrypt = encryptPayload({data, type : userTokenRole.registerToken})
    let accessToken = _generateAccessToken(encrypt.payload, userTokenRole.registerToken)
    let refreshToken = _generateRefreshToken(encrypt.payload)
    let token = {accessToken, refreshToken}
    return token
}
const generateLoginToken = async(data)=>{  // string
    let encrypt = encryptPayload({data, type : userTokenRole.loginToken})
    let accessToken = _generateAccessToken(encrypt.payload, userTokenRole.loginToken)
    let refreshToken = _generateRefreshToken(encrypt.payload)
    let tokens = {accessToken, refreshToken}
    return tokens
}

export default {
    generateUserAccessToken,
    generateRegisterToken,
    generateLoginToken,
    decryptPayload
}
