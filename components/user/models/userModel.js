import mongoose from "mongoose";
import { Model } from "../../../utils/appString.js";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        trim: true,
        default: null
    },
    nickname: {
        type: String,
        trim: true,
        default: null
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    mobile: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    secret: {
        type: String,
    },
    isProfileCompleted: {
        type: String,
        enum: ['not-Completed', 'step-1', 'completed'],
        default: 'not-Completed'
    },
    picture: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model(Model.userModel, userSchema);
export default User;