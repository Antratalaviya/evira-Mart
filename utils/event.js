import EventEmitter from "eventemitter3";
import Mail from '../components/email/index.js'
let eventEmitter = new EventEmitter()

eventEmitter.on('send-pass-with-mail', (data) => {
    Mail.verifyEmail(data.to, data.subject, data.text, data.otp)
})

export default eventEmitter