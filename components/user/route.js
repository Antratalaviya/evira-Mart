import validate from "../../middleware/validations/index.js";
import userController from "./userController.js";
import V from "./validation.js";
import verifyToken from "../../middleware/validations/index.js"


export default [
    {
        path: '/',  //admin
        method: 'get',
        controller: userController.getAllUser,
        isPublic: false,
        isEncrypt: false,
        // isAdmin : true
    }, {
        path: '/profile-status',
        method: 'get',
        controller: userController.checkStatus,
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/profile',
        method: 'get',
        controller: userController.getProfile,
        isPublic: false,
        isEncrypt: false
    }, {
        path: '/wish-list',
        method: 'get',
        controller: userController.getAllWishList,
        isPublic: false,
        isEncrypt: false
    }, {
        path: '/:id',  //admin
        method: 'get',
        controller: userController.getUser,
        isPublic: false,
        isEncrypt: false,
        // isAdmin : true 
    }, {
        path: '/wish-list/:id',
        method: 'get',
        controller: userController.getCatWishList,
        isPublic: false,
        isEncrypt: false
    },{
        path: '/register',
        method: 'post',
        validation: validate.validate(V.register),
        controller: userController.register,
        isPublic: true,
        isEncrypt: false
    }, {
        path: '/login',
        method: 'post',
        validation: validate.validate(V.login),
        controller: userController.login,
        isPublic: true,
        isEncrypt: false
    }, {
        path: '/create-profile',
        method: 'post',
        validation: validate.validate(V.postProfile),
        controller: userController.postProfile,
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/add-secret',
        method: 'post',
        validattion: validate.validate(V.addSecret),
        controller: userController.addSecret,
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/send-otp',
        method: 'post',
        controller: userController.sendOtp,
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/verify-otp',
        method: 'post',
        controller: userController.verifyOtp,
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/reset-password',
        method: 'put',
        controller: userController.resetPassword,
        validation: validate.validate(V.resetPassword),
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/profile',
        method: 'put',
        controller: userController.updateProfile,
        // validation: validate.validate(V.updateProfile),
        authMiddleware: verifyToken.verifyAuthToken,
        isEncrypt: false
    }, {
        path: '/profile',
        method: 'delete',
        controller: userController.deleteProfile,
        isPublic: false,
        isEncrypt: false
    }, {
        path: '/:id',
        method: 'delete',
        controller: userController.deleteUser,
        isPublic: false,
        isEncrypt: false
    },
]

