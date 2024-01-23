import httpStatus from 'http-status';
import userService from '../user/services.js';
import cartService from '../cart/services.js';
import productService from '../product/services.js'
import commonUtils from '../../utils/commonUtils.js'
import { AppString } from '../../utils/appString.js';

const addProductToCart = async (req, res) => {
    const body = req.body

    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_LOGIN }, httpStatus.NOT_FOUND)
    }
    if (!(await productService.getProdById(body.product))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }
    if (!(await productService.getOptionById(body.option))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.OPTION_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
    }

    let exist = await cartService.getCartByUserId(req.user._id)
    if (exist) {
        let items = exist.items
        const existingItemIndex = items.findIndex((item) =>
            item.product.toString() === body.product.toString() &&
            item.option.toString() === body.option.toString()
        );
        if (existingItemIndex !== -1) {
            await cartService.increaseQun(req.user._id, existingItemIndex, body.quantity)
            return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_PROD_ADDED }, httpStatus.OK)
        }
        else {
            await cartService.addProdToExistUser(req.user._id, body)
            return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_PROD_ADDED }, httpStatus.OK)
        }

    }
    await cartService.addProd(req.user._id, body)
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_PROD_ADDED }, httpStatus.OK)

}
const getAllCartItem = async (req, res) => {
    const { page, limit } = req.query
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_LOGIN }, httpStatus.NOT_FOUND)
    }
    let cartProd = await cartService.getAllCartProd(req.user._id, { page, limit })
    return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_RETRIEVED, cartProd }, httpStatus.OK)
}
const removeCartProd = async (req, res) => {
    const { id } = req.params

    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_LOGIN }, httpStatus.NOT_FOUND)
    }

    let exist = await cartService.getCartByUserId(req.user._id)
    if (exist) {
        let items = exist.items
        const existingItemIndex = items.findIndex((item) =>
            item._id.toString() === id.toString()
        );
        if (existingItemIndex !== -1) {
            await cartService.removeCartProd(req.user._id, items[existingItemIndex]._id)
            return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_PRODUCT_REMOVED }, httpStatus.OK)
        } else {
            return commonUtils.sendError(req, res, { success: false, message: AppString.PRODUCT_NOT_AVAILABLE }, httpStatus.NOT_FOUND)
        }
    }
    return commonUtils.sendError(req, res, { success: false, message: AppString.CART_IS_EMPTY }, httpStatus.NOT_FOUND)
}
const emptyCart = async (req, res) => {
    if (!(await userService.getUserById(req.user._id))) {
        return commonUtils.sendError(req, res, { success: false, message: AppString.USER_NOT_LOGIN }, httpStatus.NOT_FOUND)
    }

    let exist = await cartService.getCartByUserId(req.user._id)
    if (exist) {
        await cartService.deleteCart(req.user._id)
        return commonUtils.sendSuccess(req, res, { success: true, message: AppString.CART_EMPTIED }, httpStatus.OK)
    }
    return commonUtils.sendError(req, res, { success: true, message: AppString.CART_EMPTIED }, httpStatus.OK)
}
export default {
    addProductToCart,
    getAllCartItem,
    removeCartProd,
    emptyCart
}