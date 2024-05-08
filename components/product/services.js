import Product from "./models/productModel.js"
import Option from "./models/optionModel.js"
import mongoose from "mongoose"

const createProduct = (userId, body) => {
    const data = {
        user: userId,
        ...body
    }
    return Product.create(data)
}
const createOption = (prodId, body) => {
    const data = {
        product: prodId,
        ...body
    }
    return Option.create(data)
}
const getOptionById = (optionId) => {
    const query = {
        _id: optionId
    }
    const data = {
        _id: 1,
        product : 1
    }
    return Option.findOne(query, data)
}
const deleteOption = (optionId) => {
    const query = {
        _id: optionId
    }
    return Option.deleteOne(query)
}
const getFullOption = (optionId) => {
    const query = {
        _id: optionId
    }
    const data = {
        _id: 1,
        size: 1,
        price: 1,
        color: 1,
        quentity: 1
    }
    return Option.findOne(query, data)
}
const updateProdOption = (prodId, option) => {
    const query = {
        _id: prodId
    }
    const dataO = {
        $set: {
            defaultOption: option,
        }
    }
    const optionO = {
        new: true
    }
    return Product.updateOne(query, dataO, optionO)
}
const updateProdReview = (prodId, reviewId) => {
    const query = {
        _id: prodId
    }
    const dataO = {
        $set: {
            review: reviewId,
        }
    }
    const optionO = {
        new: true
    }
    return Product.updateOne(query, dataO, optionO)
}
const updateProdLikes = (prodId, userId) => {
    const query = {
        _id: prodId
    }
    const dataO = {
        $push: {
            likedBy: userId,
        }
    }
    const optionO = {
        new: true
    }
    return Product.findByIdAndUpdate(query, dataO, optionO)
}
const updateProdUnLikes = (prodId, userId) => {
    const query = {
        _id: prodId
    }
    const dataO = {
        $pull: {
            likedBy: userId,
        }
    }
    const optionO = {
        new: true
    }
    return Product.findByIdAndUpdate(query, dataO, optionO)
}
const getAllProd = ({ matchCriteria1, matchCriteria2, page, limit }) => {   //name rating(overAll) sold(number) price image
    matchCriteria1 ||= {}
    matchCriteria2 ||= {}
    page ||= 1
    limit ||= 10
    let pipeline = [
        {
            $match: matchCriteria1
        },
        {
            $match: matchCriteria2
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $unwind: {
                path: '$reviews',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                sold: { $first: '$sold' },
                picture: { $first: '$picture' },
                price: { $first: '$price' },
                reviews: { $push: '$reviews' },
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                sold: 1,
                picture: 1,
                price: 1,
                star: {
                    $round: [
                        {
                            $ifNull: [
                                {
                                    $avg: '$reviews.star'
                                },
                                0
                            ]
                        },
                        1
                    ]
                }
            }
        }

    ]
    return Product.aggregate(pipeline)
}
const getProdById = (prodId) => {
    const query = {
        _id: prodId
    }
    const data = {
        _id: 1,
        likedBy: 1,
        defaultOption : 1
    }
    return Product.findOne(query, data)
}
const getFullProdById = (prodId) => { //params : id  // name des {size clr price} {avg:star totalReview} sold picture
    let pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(prodId)
            }
        },
        {
            $lookup: {
                from: 'options',
                localField: '_id',
                foreignField: 'product',
                as: 'options'
            }
        },
        {
            $unwind: {
                path: '$options',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'options',
                localField: 'defaultOption',
                foreignField: '_id',
                as: 'defaultOption'
            }
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $unwind: {
                path: '$reviews',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$defaultOption',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                description: { $first: '$description' },
                sold: { $first: '$sold' },
                picture: { $first: '$picture' },
                reviews: { $push: '$reviews' },
                defaultOption: { $first: '$defaultOption' },
                options: { $addToSet: '$options' },
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                sold: 1,
                picture: 1,
                size: '$defaultOption.size',
                color: '$defaultOption.color',
                price: '$defaultOption.price',
                totalReview: { $size: '$reviews' },
                star: {
                    $round: [
                        {
                            $ifNull: [
                                {
                                    $avg: '$reviews.star'
                                },
                                0
                            ]
                        },
                        1
                    ]
                },
                options: {
                    $map : {
                        input : '$options',
                        as : 'option',
                        in : {
                            _id : '$$option._id',
                            color : '$$option.color',
                            size : '$$option.size',
                            price : '$$option.price',
                            quentity : '$$option.quentity'
                        }
                    }
                }
            }
        }
    ]
    return Product.aggregate(pipeline)
}
const getFilterProd = ({ keyword, category, max_price, min_price, sortBy, rating, page, limit }) => {
    let star = Number(rating)
    star ||= 0
    page ||= 1
    limit ||= 10
    let pipeline = []
    if (keyword) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: new RegExp(keyword, 'i') } },
                    { description: { $regex: new RegExp(keyword, 'i') } }
                ]
            }
        })
    }
    pipeline.push({
        $skip: (page - 1) * limit
    })
    pipeline.push({
        $limit: limit
    })
    if (category) {
        pipeline.push({
            $match: {
                category: new mongoose.Types.ObjectId(category)
            }
        })
    }
    if (max_price) {
        pipeline.push({
            $match: {
                price: { $lte: max_price }
            }
        })
    }
    if (min_price) {
        pipeline.push({
            $match: {
                price: { $gte: min_price }
            }
        })
    }
    if (sortBy === 'recent') {
        pipeline.push({
            $sort: {
                createdAt: -1
            }
        })
    } else if (sortBy === 'price_asc') {
        pipeline.push({
            $sort: {
                price: 1
            }
        })
    } else if (sortBy === 'price_dsc') {
        pipeline.push({
            $sort: {
                price: -1
            }
        })
    } else {
        pipeline.push({
            $sort: {
                star: -1
            }
        })
    }
    pipeline.push(
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        }, {
        $unwind: {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            price: { $first: '$price' },
            picture: { $first: '$picture' },
            sold: { $first: '$sold' },
            review: { $push: '$reviews' }
        }
    },
        {
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                price: 1,
                picture: 1,
                star: {
                    $round: [
                        {
                            $ifNull: [
                                {
                                    $avg: '$review.star'
                                },
                                0
                            ]
                        },
                        1
                    ]
                }
            }
        }
    )
    if (star === 0) {
        pipeline.push({
            $sort: {
                star: -1
            }
        })
    } else {
        pipeline.push({
            $match: {
                star: { $eq: star }
            }
        })
    }
    return Product.aggregate(pipeline)
}

export default {
    createProduct,
    createOption,
    getOptionById,
    getFullOption,
    deleteOption,
    updateProdOption,
    getAllProd,
    updateProdReview,
    updateProdLikes,
    updateProdUnLikes,
    getProdById,
    getFullProdById,
    getFilterProd
}