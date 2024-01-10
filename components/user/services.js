import bcrypt from 'bcrypt';

import User from "./models/userModel.js";
import tokenService from "../../auth/index.js"

const getUserWithEmail = (email) => {
    const query = {
        email
    }
    const data = {
        password: 1,
        isProfileCompleted: 1
    }
    return User.findOne(query, data);
}

const createUser = async (userBody) => {
    userBody.password = await bcrypt.hash(userBody.password, 10)
    let user = await User.create(userBody)
    // const tokens = await tokenService.generateRegisterToken({ _id: user._id, email: user.email })
    // user.refreshToken = tokens.refreshToken
    // await user.save()
    // console.log(user)
    return {
        email: user.email,
        isProfileCompleted: user.isProfileCompleted,
        // accessToken: tokens.accessToken
    }
}


const getUserWithId = (_id) => {
    const query = {
        _id
    }

    const data = {
        _id: 1,
    }
    return User.findOne(query, data)
}

const getFullUserById = (_id, userBody) => {
    const query = {
        _id
    }
    const data = (typeof userBody === 'object' && Object.keys(userBody).length >= 1)
        ? { ...userBody }
        : {
            fullname: 1,
            nickname: 1,
            dateOfBirth: 1,
            mobile: 1,
            gender: 1,
            isProfileCompleted: 1
        }
    return User.findOne(query, data)
}

const updateUser = async (_id, userBody, isProfileCompleted) => {
    const query = {
        _id
    }
    const data = {
        $set : {
            ...userBody,
            isProfileCompleted : isProfileCompleted
        }
    }
    const option = {
        new : true
    }
    return User.updateOne(query, data, option)
}
export default {
    getUserWithEmail,
    createUser,
    getUserWithId,
    getFullUserById,
    updateUser
}