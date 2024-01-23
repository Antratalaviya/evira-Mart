import productController from "./productController.js"
import V from './validation.js'
import validations from "../../middleware/validations/index.js"

export default [
    {
        path: '/',
        method: 'get',
        controller: productController.getAllProduct,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/filter',
        method: 'get',
        controller: productController.getFilterProd,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/:id',
        method: 'get',
        controller: productController.getProduct,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/option/:id',
        method: 'get',
        controller: productController.getOption,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/category/:id',
        method: 'get',
        controller: productController.getAllCatProd,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/create-product',   //admin
        method: 'post',
        controller: productController.createProd,
        validation: validations.validate(V.createProd),
        isPublic: false,
        isEncrypt: false
    }, {
        path: '/create-option',   //admin
        method: 'post',
        controller: productController.postOption,
        validation: validations.validate(V.postOption),
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/like',
        method: 'post',
        controller: productController.likeProduct,
        isPublic: false,
        isEncrypt: false
    }, {
        path: '/option/:id',  
        method: 'delete',
        controller: productController.deleteOption,  //admin
        isPublic: false, 
        isEncrypt: false
    }
]
