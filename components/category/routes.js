import catController from "./catController.js"

export default [
    {
        path : '/',
        method : 'get',
        controller : catController.getAllCat,
        isPublic : false,
        isEncrypt : false,
    },
    {
        path : '/create-category',
        method : 'post',
        controller : catController.createCat,
        isPublic : false,
        isEncrypt : false,
    }
]