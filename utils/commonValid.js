import joi from 'joi';

const stringValidation = joi.string().trim()
const stringReqValidation = stringValidation.required()
const dateValidation = joi.date()
const numValidation = joi.number()
// user validations
const emailValidation = stringReqValidation.email()
const passwordValidation = stringReqValidation
    .min(6)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\|[\]`~]).{6,30}$/)
    .message('Password must be at least 6 characters long and include at least one digit, one lowercase letter, one uppercase letter, and one special character.')
    .required()
const confirmPassword = passwordValidation
const fullnameValidation = stringReqValidation.min(3).max(30)
const nicknameValidation = stringReqValidation.max(15)
const genderValidation = stringReqValidation.valid('male', 'female', 'other')
const dateReqValidation = dateValidation.required()
const mobileValidation = stringValidation.pattern(new RegExp(/^[0-9]{10}$/))
const secretValidation = stringReqValidation.pattern(new RegExp(/^[0-9]{4}$/))
const picValidation = stringValidation

const prodnameValidation = stringReqValidation
const desValidation = stringValidation
const sizeValidation = stringValidation
const colorValidation = stringValidation.pattern(new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/))
const quentityValidation = numValidation.positive().precision(2)
const quentityReqValidation = quentityValidation.required()
const priceValidation = stringValidation
const priceReqValidation = priceValidation.required()
const soldValidation = numValidation
const pictureValidation = stringReqValidation

// category validation
const categoryValidation = stringReqValidation

// review validation
const starValidation = numValidation.min(1).max(5).required()
const commentValidation = stringReqValidation



export default {
    emailValidation,
    dateValidation,
    passwordValidation,
    fullnameValidation,
    nicknameValidation,
    genderValidation,
    picValidation,
    dateReqValidation,
    mobileValidation,
    secretValidation,
    confirmPassword,
    prodnameValidation,
    desValidation,
    sizeValidation,
    colorValidation,
    quentityValidation,
    quentityReqValidation,
    priceValidation,
    priceReqValidation,
    soldValidation,
    pictureValidation,
    categoryValidation,
    starValidation,
    commentValidation
}
