import mongoose from "mongoose";
import { Model } from "../../utils/appString.js";

const cartSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    items : [{
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref:'product',
            required : true
        },
        option : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Option',
            required : true
        },
        quantity : {
            type : Number,
            required : true
        }
    }]  
}, {
    timestamps : true
})

const Cart = mongoose.model(Model.cartModel, cartSchema)
export default Cart