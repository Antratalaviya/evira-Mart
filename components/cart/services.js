import mongoose from "mongoose"
import Cart from "./cartModel.js"

const addProd = (userId, body) => {
    const data = {
        user: userId,
        items: {
            ...body
        }
    }
    return Cart.create(data)
}
const getAllCartProd = (userId, { page, limit }) => {
    page ||= 1
    limit ||= 10
    let pipeline = [
        {
            $match: {
                user: userId
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $unwind: {
                path: '$items'
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $lookup: {
                from: 'options',
                localField: 'items.option',
                foreignField: '_id',
                as: 'option'
            }
        },
        {
            $unwind: '$option'
        },
        {
            $group: {
                _id: '$_id',
                items: {
                    $addToSet: {
                        _id: '$items._id',
                        name: '$product.name',
                        size: '$option.size',
                        quantity: '$items.quantity',
                        price: '$option.price'
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                items: 1
            }
        }

    ]
    return Cart.aggregate(pipeline)
}

const getAllCartProdById = (userId) => {
    const query = {
        user: userId
    }
    const data = {
        items: 1
    }
    return Cart.findOne(query, data)
}
const getCartByUserId = (userId) => {
    const query = {
        user: userId
    }
    const data = {
        _id: 1,
        items: 1
    }
    return Cart.findOne(query, data)
}
const addProdToExistUser = (userId, body) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId)
    }
    const data = {
        $push: {
            items: {
                ...body
            }
        }
    }
    const option = {
        new: true
    }
    return Cart.updateOne(query, data, option)
}
const removeCartProd = (userId, itemId)=>{
    const query = {
        user : userId
    }
    const data = {
        $pull : {
            items : {
                _id : itemId
            }
        }
    }
    const options = {
        new : true
    }
    return Cart.findOneAndUpdate(query, data, options)
}
const increaseQun = (userId, index, quantity) => {
    const query = {
        user: userId
    };

    const data = {
        $inc: {
            [`items.${index}.quantity`]: quantity
        }
    };

    const options = {
        new: true
    };
    return Cart.findOneAndUpdate(query, data, options)
}
const decreaseQun = (userId, index, quantity) => {
    const query = {
        user: userId
    };

    const data = {
        $inc: {
            [`items.${index}.quantity`]: -quantity
        }
    };

    const options = {
        new: true
    };
    return Cart.findOneAndUpdate(query, data, options)
}
const deleteCart = (userId)=>{
    const query = {
        user : userId
    }
    return Cart.deleteOne(query)
}
export default {
    addProd,
    getAllCartProd,
    getAllCartProdById,
    getCartByUserId,
    addProdToExistUser,
    increaseQun,
    decreaseQun,
    removeCartProd,
    deleteCart
}