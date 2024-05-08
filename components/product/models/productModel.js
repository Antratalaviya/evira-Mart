import mongoose from "mongoose";
import { Model } from "../../../utils/appString.js";

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,  //
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    defaultOption: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Option',
        }
    ],
    quentity: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0    //
    },
    picture: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {
    timestamps: true
})

const Product = mongoose.model(Model.prodModel, productSchema)

export default Product