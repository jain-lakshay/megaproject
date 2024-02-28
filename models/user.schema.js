import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import config from "../config/index";


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

// cahllange -1 encrypt the password - hooks 
userSchema.pre("save", async function (next){
    if(!this.modefied("password"))return next ();
    this.password= await bcrypt.hash(this.password,10)
    next()
})

//add more feature directly to your schema
userSchema.methods ={
//compare password
comparePassword: async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
},
//generate jwt token
getJwtToken: function(){
    return JWT.sign(
        {
            _id:this._id,
            role:this.role

        },
        config.JWT_SECRET,
        {
            expiresIn:config.JWT_EXPIRY
        }

    )
}

}


export default mongoose.model("User",userSchema)


