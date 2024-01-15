import httpStatus from 'http-status'
import slugify from 'slugify'
import { AppString } from '../../utils/appString.js'
import commonUtils from '../../utils/commonUtils.js'
import userService from '../user/services.js'
import catService from './services.js'

const getAllCategory = async (req, res) => {

}

const createCat = async (req, res) => {
    const body = req.body
    let admin = await userService.getUserById(req.user._id)
    if (!admin) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.ADMIN_NOT_FOUND }, httpStatus.NOT_FOUND)
    }
    if (body.name) {
        body.name = slugify(body.name)
    }
    await catService.createCat(body)
    return commonUtils.sendSuccess(req, res, { success: false, message: AppString.CATEGORY_CREATED }, httpStatus.OK)
}
const getAllCat = async (req, res) => {
    const { page, limit } = req.query
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let cats = await catService.getAllCat({ page, limit })
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CATEGORY_RETRIEVED, cats }, httpStatus.OK)
}
export default {
    createCat,
    getAllCat
}