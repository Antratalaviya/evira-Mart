import cartController from "./cartController.js";


export default [
    {
        path: '/',
        method: 'get',
        controller: cartController.getAllCartItem,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/add-product',
        method: 'post',
        controller: cartController.addProductToCart,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/product/:id',
        method: 'delete',
        controller: cartController.removeCartProd,
        isPublic: false,
        isEncrypt: false
    },
    {
        path: '/',
        method: 'delete',
        controller: cartController.emptyCart,
        isPublic: false,
        isEncrypt: false
    },
]