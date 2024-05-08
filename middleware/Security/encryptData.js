import crypto from 'crypto';

const encryptDataResponse = (data) => {
    const key = process.env.API_KEY_ENC
    const iv = process.env.API_ENCRYPT_VI_KEY
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encMsg = cipher.update(JSON.stringify(data), 'utf-8', 'base64')
    encMsg += cipher.final('base64')

    return {
        value : encMsg
    }
}
const encryptData = (req, res, data) => {  // data : object
    return encryptDataResponse(data)
}

export default {
    EncryptData: encryptData
}