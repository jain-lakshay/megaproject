import mongoose from "mongoose";

import AuthRoles from "../utils/authRoles";

const userSchema = mongoose.Schema(
    {

        name:{
            type: String,
            required:[true," the name is required"],
            maxLength:[50,"maximum length is 50"]
        },
        email:{
            type: String,
            required:[true," the eamil is required"],
           unique: true
        },
       password:{
            type: String,
            required:[true," the password is required"],
           minLength:[5,"minimum  length is 5"],
           select:false,
        },
        role:{
            type:String,
            enum:Object.values(AuthRoles),
            default:AuthRoles.USER
        },
        forgotPasswordToken:String,
        forgotPasswordExpiry:Date,
    },
    {
        timestamps:true
    }
);

export default mongoose.model("User",userSchema)


