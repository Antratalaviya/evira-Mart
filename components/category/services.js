import Catagory from "./categoryModel.js"

const createCat = (body) => {
    const data = {
        ...body
    }
    return Catagory.create(data)
}
const getAllCat = ({page, limit}) => {
    page ||= 1
    limit ||= 10
    return Catagory.find().skip((page - 1) * limit).limit(limit)
}
const getCatById = (catId)=>{
    const query = {
        _id : catId
    }
    const data = {
        _id : 1
    }
    return Catagory.findOne(query, data)
}
export default {
    createCat,
    getAllCat,
    getCatById
}