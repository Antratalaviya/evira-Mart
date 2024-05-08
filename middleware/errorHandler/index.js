import httpStatus from "http-status";
import commonUtils from "../../utils/commonUtils.js";

const notFound = (req, res, next)=>{
    let err = new Error("Not found : " + req.originalUrl);
    res.status(httpStatus.NOT_FOUND);
    next(err);
}
const errorHandler = (err, req, res, next) => {
    const statusCode = req.statusCode ? req.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message;

    commonUtils.sendError(req, res, message, statusCode);
}

export default {notFound, errorHandler}