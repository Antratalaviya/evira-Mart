import validate from "../../middleware/validations/index.js";
import userController from "./userController.js";
import V from "./validation.js";
import verifyToken from "../../middleware/validations/index.js"


export default [
    {
        path: '/register',
        method: 'post',
        validation: validate.validate(V.register),
        controller: userController.register,
        isPublic: true,
        // isEncrypt: true
    },
    {
        path: '/login',
        method: 'post',
        validation: validate.validate(V.login),
        controller: userController.login,
        authMiddleware : verifyToken.verifyAuthToken,
        isEncrypt: false
    },
    {
        path: '/create-profile',
        method: 'post',
        validation: validate.validate(V.postProfile),
        controller: userController.postProfile,
        authMiddleware : verifyToken.verifyAuthToken,
        isEncrypt: false
    },
    {
        path : '/add-secret',
        method : 'post',
        validattion : validate.validate(V.addSecret),
        controller : userController.addSecret,
        authMiddleware : verifyToken.verifyAuthToken,
        isEncrypt : false
    },
    {
        path : '/profile-status',
        method : 'get',
        controller : userController.checkStatus,
        authMiddleware : verifyToken.verifyAuthToken,
        isEncrypt : false
    }
]

