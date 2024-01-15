import validations from "../../middleware/validations/index.js";
import reviewController from "./reviewController.js";
import V from './validation.js'

export default [
    {
        path: '/:id',
        method: 'get',
        controller: reviewController.getAllreview,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/like',
        method: 'post',
        controller: reviewController.likeReview,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/post-review',
        method: 'post',
        controller: reviewController.postReview,
        validation: validations.validate(V.postReview),
        isPublic: false,
        isEncrypt: false
    },
]