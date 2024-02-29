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

/******************************************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User signIn Controller for loging new user
 * @parameters  email, password
 * @returns User Object
 ******************************************************/
export const login =asyncHandler(async(req,res)=>{
const{email,password}=req.body

if(!email||!password){
   throw  new CustomError('please fill the required field',400)
}
//find user
const user = User.findOne({email}).select("+password")//read documentation moongoose select
if(!user){
   throw new CustomError('Invalid Credantial',400)
}
//comparing the password
const isPasswordMatched= await user.comparePassword(password)
if(isPasswordMatched){
const token =user.getJwtToken()
user.password=undefined
res.cookie("token",token,cookieOptions)
return res.status(200).json({
   success:true,
   token,
   user,

})
}
throw new CustomError('Invalid Credential')
})

/******************************************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User logout bby clearing user cookies
 * @parameters  
 * @returns success message
 ******************************************************/

 export const logout = asyncHandler(async(req,res)=>{
   res.cookie('token',null,{
      expires: new Date(Date.now()),
      httpOnly:true
   })
   res.status(200).json({
      success:true,
      message:"loggedout"
   })
 })