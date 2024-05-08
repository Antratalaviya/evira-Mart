import mongoose from "mongoose";
import { Model } from "../../../utils/appString.js";

const optionSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    color: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: null
    },
    price: {
        type: String,
        dafault: null
    },
    quentity: {
        type: Number,
        default: 0,
    },
}, {
    autoIndex: false
})

export default mongoose.model(Model.optionModel, optionSchema)