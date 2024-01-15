import httpStatus from 'http-status'
import userService from '../user/services.js'
import productService from '../product/services.js'
import commonUtils from '../../utils/commonUtils.js'
import { AppString } from '../../utils/appString.js'
import reviewService from './services.js'

const postReview = async (req, res) => {
    const body = req.body
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }

    let review = await reviewService.postReview(user._id, body)
    await productService.updateProdReview(review.product, review)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.REVIEW_POSTED }, httpStatus.OK)
}
const likeReview = async (req, res) => {  //params : review Id
    const { _id } = req.body
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let review = await reviewService.getReviewById(_id)
    if (!review) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.REVIEW_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    let alreadyLiked = review.likedBy.find((id) => id.toString() == user._id.toString())
    if (alreadyLiked) {
        await reviewService.updateReviewUnLike(user._id, _id)
        return commonUtils.sendSuccess(req, res, { success: true, message: AppString.REVIEW_UNLIKED }, httpStatus.OK)
    }
    await reviewService.updateReviewLike(user._id, _id)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.REVIEW_LIKED }, httpStatus.OK)
}
const getAllreview = async (req, res) => {  //get all reviews of that product
    const { id } = req.params
    const {star, page, limit} = req.query
    let user = await userService.getUserById(req.user._id)
    if (!user) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_EXIST }, httpStatus.NOT_FOUND)
    }
    let product = await productService.getProdById(id)
    if (!product) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    let reviews = await reviewService.getAllReview(id, {star, page, limit})
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.REVIEW_RETRIEVED, reviews }, httpStatus.OK)
}
export default {
    postReview,
    likeReview,
    getAllreview
}