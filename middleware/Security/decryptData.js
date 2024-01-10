import crypto from 'crypto'
import commonUtils from '../../utils/commonUtils.js'
import { AppString } from '../../utils/appString.js'
import httpStatus from 'http-status'

const decryptDataResponse = async (req, res, next) => {
    const key = process.env.API_KEY_ENC
    const iv = process.env.API_ENCRYPT_VI_KEY
    try {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
        if (req.body && req.body.value && req.body.value !== '') {
            let decMsg = decipher.update(req.body.value, 'base64', 'utf-8')
            decMsg += decipher.final('utf-8')
            req.body = JSON.parse(decMsg)
            next()
        }
        else {
            return commonUtils.sendError(req, res, { message: AppString.DECRYPT_DATA_IS_REQ }, httpStatus.NOT_FOUND)
        }
    } catch (error) {
        return commonUtils.sendError(req, res, { message: error }, httpStatus.INTERNAL_SERVER_ERROR)
    }
}
const decryptData = (req, res, next) => {
    if (req.method == 'GET') {
        next()
    }
    else {
        if (req.method == 'PUT' && req.body && JSON.stringify(req.body) == '{}') {
            next()
        } else {
            return decryptDataResponse(req, res, next)
        }
    }

}

export default {
    DecryptData: decryptData
}