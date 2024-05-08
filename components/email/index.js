import nodeMailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import ejs from 'ejs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filepath = path.join(__dirname + '/verificationEmail.ejs')

const verifyEmail = (msg) => {
    const transport = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASSWORD
        }
    })
    let otp = msg.otp
    return ejs.renderFile(filepath, { otp }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let mailOption = {
                from: process.env.MAIL_ID,
                to: msg.to,
                subject: msg.subject,
                text: msg.text,
                html: data
            }
            transport.sendMail(mailOption, (err, info) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    })
}


export default {
    verifyEmail
}