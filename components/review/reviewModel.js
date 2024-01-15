import mongoose from "mongoose";
import { Model } from "../../utils/appString.js";

const reviewModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required : true
    },
    star: {
        type: Number,
        required: true,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
})

const Review = mongoose.model(Model.reviewModel, reviewModel)
export default Review