 import User from '../models/user.schema'
 import asyncHandler from '../services/asyncHandler'
 import CustomError from '../utils/customError'


 export const cookieOptions = {
    expires: new Date(Date.now()+3*24*60*60*100),
    httpOnly:true,

 }
/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/
 export const signUp = asyncHandler(async(req,res)=>{
const {name,email,password}=req.body

if (!name||!email||!password){
   throw new CustomError('please fill all field',400)
}
//check if user exist
 const existingUser = await User.findOne({email})

 if(existingUser){
   throw new CustomError('user already exist',400)
 }
//create user
 const user = await User.Create({
   name,
   email,
   password,

 })
 //creating the token
 const token = user.getJwtToken()
 console.log(user);
 user.password=undefined

 res.cookie("token",token,cookieOptions)

res.status(200).json({
  success:true,
  token,
  user,

})
 })