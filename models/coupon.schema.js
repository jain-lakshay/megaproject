import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code:{
            type:String,
            required:[true,"please provide the coupon name"]

        },
discount:{
    type:Number,
   default:0
},
active:{
type:Boolean,
default:true

}

    },
    {
        timestamps:true
    }
)

export default mongoose.Schema("coupon",couponSchema)