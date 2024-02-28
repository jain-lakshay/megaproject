import mongoose from "mongoose";

const collectionSchema= new mongoose.Schema(
    {
name: {

    type:String,
    required: [true , "please provide a category name"],
    trim:true,
    maxLength:[120,"collection should not be more than 120 character"]
}

},
{
    timestamps:true
}
);
export default mongoose.model("collection",collectionSchema)