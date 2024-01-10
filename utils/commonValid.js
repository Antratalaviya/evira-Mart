import joi from 'joi';

const stringValidation = joi.string().trim()
const stringReqValidation = stringValidation.required()
const dateValidation = joi.date()

const emailValidation = stringReqValidation.email()
const passwordValidation = stringReqValidation
                            .min(6)
                            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\|[\]`~]).{8,30}$/)
                            .message('Password must be at least 8 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character.')
const fullnameValidation = stringReqValidation.min(3).max(30)
const nicknameValidation = stringReqValidation.max(15)
const genderValidation = stringReqValidation.valid('male', 'female', 'other')
const dateReqValidation = dateValidation.required()
const mobileValidation = stringReqValidation.pattern(new RegExp(/^[0-9]{10}$/))
const secretValidation = stringReqValidation.pattern(new RegExp(/^[0-9]{4}$/))


export default {
    emailValidation,
    dateValidation,
    passwordValidation,
    fullnameValidation,
    nicknameValidation,
    genderValidation,
    dateReqValidation,
    mobileValidation,
    secretValidation
}
