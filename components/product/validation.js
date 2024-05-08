import Joi from "joi";
import V from "../../utils/commonValid.js"
const createProd = {
    body: Joi.object().keys({
        name: V.prodnameValidation,
        description: V.desValidation,
        price: V.priceReqValidation,
        quentity: V.quentityReqValidation,
        picture: V.pictureValidation,
        category: V.categoryValidation,
        defaultOption: Joi.object().keys({
            size: V.sizeValidation,
            color: V.colorValidation,
            price: V.priceValidation,
            quentity: V.quentityValidation
        })
    })
}
const postOption = {
    body : Joi.object().keys({
        size: V.sizeValidation,
        color: V.colorValidation,
        price: V.priceReqValidation,
        quentity: V.quentityReqValidation
    })
}
export default {
    createProd,
    postOption
}