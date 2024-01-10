import httpStatus from "http-status";
import bcrypt from 'bcrypt'
import { AppString } from "../../utils/appString.js"
import commonUtils from "../../utils/commonUtils.js"
import userService from "./services.js"
import tokenService from "../../auth/index.js"

const register = async (req, res) => {
    // try {
        const { email, password } = req.body;
        const user = await userService.getUserWithEmail(email)
        if (user) {
            return commonUtils.sendError(req, res, { success: true, message: AppString.USER_ALREADY_EXIST }, httpStatus.CONFLICT)
        }
        let newUser = await userService.createUser({ email : email, password : password})
        console.log(newUser)
        return commonUtils.sendSuccess(req, res, { success: true, message: AppString.USER_CREATED, newUser }, httpStatus.OK)
    // } catch (error) {
    //     return commonUtils.sendError(req, res, { success: false, error: AppString.SOMETHING_WENT_WRONG }, httpStatus.INTERNAL_SERVER_ERROR)
    // }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await userService.getUserWithEmail(email)
        if (!user) {
            return commonUtils.sendError(req, res, {
                success: false,
                message: AppString.USER_NOT_EXIST
            }, httpStatus.NOT_FOUND)
        }
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return commonUtils.sendError(req, res, {
                success: false,
                message: AppString.INVALID_PASS
            }, httpStatus.FORBIDDEN)
        }
        let tokens = await tokenService.generateLoginToken({ _id: user._id, email: email })
        user.refreshToken = tokens.refreshToken
        await user.save()
        if (user.isProfileCompleted == 'not-Completed' || user.isProfileCompleted == 'step-1') {
            return commonUtils.sendError(req, res, {
                success: false,
                message: AppString.PROFILE_INCOMPLETED
            }, httpStatus.UNAUTHORIZED)
        }
        return commonUtils.sendSuccess(req, res, {
            success: true,
            token: tokens.accessToken
        }, httpStatus.OK)
    } catch (error) {
        return commonUtils.sendError(req, res, { success: false, error: AppString.SOMETHING_WENT_WRONG }, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

const postProfile = async (req, res) => {
    const userBody = req.body
    const user = await userService.getUserWithId(req.user._id)
    if (user) {
        const updatedUser = await userService.updateUser(user._id, userBody, 'step-1')
        return commonUtils.sendSuccess(
            req,
            res,
            {
                success: true,
                message: AppString.PROFILE_STEP_1
            },
            httpStatus.OK
        )
    }
    return commonUtils.sendError(req, res, {
        success: false,
        message: AppString.USER_NOT_EXIST
    }, httpStatus.NOT_FOUND)

}

const addSecret = async (req, res) => {
    const exist = await userService.getUserWithId(req.user._id)
    if (exist) {
        const user = await userService.updateUser(exist._id, req.body, 'completed')
        return commonUtils.sendSuccess(
            req,
            res,
            {
                success: true,
                message: AppString.PROFILE_COMPLETED
            },
            httpStatus.OK
        )
    }
    return commonUtils.sendError(req, res, {
        success: false,
        message: AppString.USER_NOT_EXIST
    }, httpStatus.NOT_FOUND)
}

const checkStatus = async (req, res) => {
    const exist = await userService.getFullUserById(req.user._id)
    console.log(exist)
    if (exist) {
        let message = ''
        if (exist.isProfileCompleted == 'not-Completed') {
            message = AppString.PROFILE_INCOMPLETED
        } else if (exist.isProfileCompleted == 'step-1') {
            message = AppString.PROFILE_STEP_1
        } else message = AppString.PROFILE_COMPLETED
        return commonUtils.sendSuccess(
            req,
            res,
            {
                success: true,
                message: message
            },
            httpStatus.OK
        )
    }
    return commonUtils.sendError(req, res, {
        success: false,
        message: AppString.USER_NOT_EXIST
    }, httpStatus.NOT_FOUND)
}

export default {
    register,
    login,
    postProfile,
    addSecret,
    checkStatus
}