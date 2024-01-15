import mongoose from "mongoose"
import Review from "./reviewModel.js"


const postReview = (userId, body) => {
    const data = {
        user: userId,
        ...body
    }
    return Review.create(data)
}

const updateReviewLike = (userId, reviewId) => {
    const query = {
        _id: reviewId
    }
    const data = {
        $push: {
            likedBy: userId
        },
    }
    const option = {
        new: true
    }
    const review = Review.updateOne(query, data, option)
    return review
}
const updateReviewUnLike = (userId, reviewId) => {
    const query = {
        _id: reviewId
    }
    const data = {
        $pull: {
            likedBy: userId
        },
    }
    const option = {
        new: true
    }
    const review = Review.updateOne(query, data, option)
    return review
}
const getReviewById = (reviewId) => {
    const query = {
        _id: reviewId
    }
    const data = {
        _id: 1,
        likedBy: 1
    }
    return Review.findOne(query, data)
}
const getAllReview = (prodId, { rating, page, limit }) => {  // query convert number into string
    let star = Number(rating)
    star ||= 0
    page ||= 1
    limit ||= 10
    let pipeline = []
    pipeline.push({
        $match: {
            product: new mongoose.Types.ObjectId(prodId)
        }
    })
    pipeline.push({
        $skip: (page - 1) * limit
    })
    pipeline.push({
        $limit: limit
    })
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
    pipeline.push({
        $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'users'
        }
    }, {
        $unwind: {
            path: '$users',
            preserveNullAndEmptyArrays: true
        }
    }, {
        $group: {
            _id: '$_id',
            user: { $first: '$users' },
            star: { $first: '$star' },
            comment: { $first: '$comment' },
            likes: {
                $first: {
                    $size: '$likedBy'
                }
            }
        }
    }, {
        $project: {
            _id: 1,
            fullname: '$user.fullname',
            picture: '$user.picture',
            star: 1,
            comment: 1,
            likes: 1
        }
    })
    return Review.aggregate(pipeline)
}
export default {
    postReview,
    updateReviewLike,
    updateReviewUnLike,
    getReviewById,
    getAllReview
}