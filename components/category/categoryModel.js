import mongoose from "mongoose";
import { Model } from "../../utils/appString.js";

const catSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description : {
        type : String
    }
}, {
    autoIndex: false
})

const Catagory = mongoose.model(Model.catModel, catSchema)

export default Catagory