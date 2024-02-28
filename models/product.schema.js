import mongoose from "mongoose "

const productSchema= new mongoose.Schema(
    {
name:{
    type:String,
    required:[true,"please provide the product name"],
    trim:true,
    maxLength:[120,"max length should not be more then 120 character"]
    
},

price:{
    type:Number,
    required:[true,"please provide the product price"],
    
    maxLength:[6,"max price should not be more then character"]
    
},
description:{
    type:String,

},
photos:[
    {
        secure_url:{
            type:String,
            required:true
        }
    }
],
stock:{
    type:Number,
    default:0
},
sold:{
    type:Number,
    default:0
},
//reference of a collection
collectionId:{
    type: mongoose.Schema.Types.objectId,
    ref:"collection"
}

},
{
    timestamps:true
}
)

export default mongoose.model("product",productSchema)