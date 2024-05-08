import crypto from 'crypto'

const generateString = (length) => {  //generate iv(initial vector)
    if (length < 0) {
        throw new Error("zero length string means nothing")
    }
    let byte = crypto.randomBytes(16)
    let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '1234567890'
    let obj = ''
    for (let i = 0; i < byte.length; ++i) {
        obj += char[byte.readUInt8(i) % char.length]
    }
    return obj
}
const encrypt = (data, key) => {
    let iv = generateString(16)
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encMsg = cipher.update(data, 'utf-8', 'base64')
    encMsg += cipher.final('base64')
    return iv + encMsg.toString("base64")
}
const decrypt = (data, key) => {
    let iv = data.toString().substring(0, 16)
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decMsg = decipher.update(data.substring(16), 'base64', 'utf-8')
    decMsg += decipher.final('utf-8')
    return decMsg.toString('utf-8');
}


export default {
    encrypt,
    decrypt
}

