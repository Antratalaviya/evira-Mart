import joi from 'joi';
import validation from "../../utils/commonValid.js";

const register = {
    body: joi.object().keys({
        email: validation.emailValidation,
        password : validation.passwordValidation
    })
}
const login = {
    body: joi.object().keys({
        email: validation.emailValidation,
        password : validation.passwordValidation
    })
}
const postProfile = {
    body: joi.object().keys({
        fullname: validation.fullnameValidation,
        nickname : validation.nicknameValidation,
        dateOfBirth : validation.dateReqValidation,
        mobile : validation.mobileValidation,
        gender : validation.genderValidation,
        picture : validation.picValidation
    })
}

const addSecret = {
    body : joi.object().keys({
        secret : validation.secretValidation
    })
}
const resetPassword = {
    body : joi.object().keys({
        password : validation.passwordValidation,
        confirmPassword : validation.confirmPassword
    })
}

const updateProfile = {
    body: joi.object().keys({
        email : validation.emailValidation,
        fullname: validation.fullnameValidation,
        nickname : validation.nicknameValidation,
        dateOfBirth : validation.dateReqValidation,
        mobile : validation.mobileValidation,
        gender : validation.genderValidation,
    })
}
export default {
    register,
    login,
    postProfile,
    addSecret,
    resetPassword,
    updateProfile
}