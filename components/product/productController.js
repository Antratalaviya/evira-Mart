import httpStatus from 'http-status'
import slugify from 'slugify'
import { AppString } from '../../utils/appString.js'
import commonUtils from '../../utils/commonUtils.js'
import userService from '../user/services.js'
import productService from './services.js'
import catService from '../category/services.js'
import mongoose from 'mongoose'

const createProd = async (req, res) => { //body  //admin
    try {
        const body = req.body
        let admin = await userService.getUserById(req.user._id)
        if (!admin) {
            return commonUtils.sendError(req, res, { success: false, message: AppString.ADMIN_NOT_FOUND }, httpStatus.NOT_FOUND)
        }
        if (body.name) {
            body.name = slugify(body.name)
        }
        if (body.defaultOption) {
            const optionObject = Object.assign({}, body.defaultOption)
            delete body.defaultOption
            let product = await productService.createProduct(admin._id, body)
            let option = await productService.createOption(product._id, optionObject[0])
            await productService.updateProdOption(product._id, option)
            return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_CREATED }, httpStatus.OK)
        }
        return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_CREATED }, httpStatus.OK)
    } catch (error) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.SOMETHING_WENT_WRONG }, httpStatus.INTERNAL_SERVER_ERROR)
    }

}

const getAllProduct = async (req, res) => { //query : page limit sort
    const { page, limit } = req.query
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendSuccess(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let products = await productService.getAllProd({ page, limit })
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_RETRIEVED, products }, httpStatus.OK)
}
const likeProduct = async (req, res) => {
    const { _id } = req.body
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendSuccess(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let product = await productService.getProdById(_id)
    if (!product) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    let alreadyLiked = product.likedBy.find((id) => id.toString() == user._id.toString())
    if (alreadyLiked) {
        await productService.updateProdUnLikes(_id, user._id)
        await userService.removeProdWishList(_id, user._id)
        return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_UNLIKED }, httpStatus.OK)
    }
    await userService.addProdWishList(_id, user._id)
    await productService.updateProdLikes(_id, user._id)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_LIKED }, httpStatus.OK)
}
const getProduct = async (req, res) => { //params : id  // name des size clr quen avg:star srtar sold price picture
    const { id } = req.params
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let product = await productService.getFullProdById(id)
    if (!product) {
        return commonUtils.sendError(req, res, { seccess: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_RETRIEVED, product }, httpStatus.OK)
}

const getAllCatProd = async (req, res) => {  //cat : id 
    const { id } = req.params
    const { page, limit } = req.query
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    if (!(await catService.getCatById(id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.CATEGORY_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    const matchCriteria1 = { category: new mongoose.Types.ObjectId(id) }
    let product = await productService.getAllProd({ matchCriteria1, page, limit })
    if (!product) {
        return commonUtils.sendError(req, res, { seccess: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_RETRIEVED, product }, httpStatus.OK)
}

const getFilterProd = async (req, res) => {
    const { keyword, category, max_price, min_price, sortBy, rating, page, limit } = req.query
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let products = await productService.getFilterProd({ keyword, category, max_price, min_price, sortBy, rating, page, limit })
    if (!products) {
        return commonUtils.sendError(req, res, { success: true, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.PRODUCT_RETRIEVED, products }, httpStatus.OK)
}
const postOption = async (req, res) => {  //body //admin
    const body = req.body
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.ADMIN_NOT_FOUND }, httpStatus.NOT_FOUND)
    }
    let product = await productService.getProdById(body.product)
    if (!product) {
        return commonUtils.sendError(req, res, { success: true, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    delete body.product
    await productService.createOption(product._id, body)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.OPTION_CREATED }, httpStatus.OK)
}

const deleteOption = async (req, res) => {
    const { id } = req.params //optionId
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.ADMIN_NOT_FOUND }, httpStatus.NOT_FOUND)
    }
    let option = await productService.getOptionById(id)

    if (!option) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.OPTION_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    let product = await productService.getProdById(option.product)
    if (product.defaultOption.toString() === option._id.toString()) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.OPTION_CAN_NOT_DELETE }, httpStatus.NOT_FOUND)
    }
    await productService.deleteOption(id)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.OPTION_DELETED }, httpStatus.OK)
}
const getOption = async (req, res) => {
    const { id } = req.params
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.ADMIN_NOT_FOUND }, httpStatus.NOT_FOUND)
    }
    let option = await productService.getFullOption(id)
    if (!option) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.OPTION_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.OPTION_RETRIVED, option }, httpStatus.OK)

}
export default {
    createProd,
    getAllProduct,
    likeProduct,
    getProduct,
    getAllCatProd,
    getFilterProd,
    postOption,
    deleteOption,
    getOption
}