import Joi from "joi";
import V from '../../utils/commonValid.js'

const postReview = {
    body: Joi.object().keys({
        star: V.starValidation,
        comment: V.commentValidation
    })
}

export default {
    postReview
}