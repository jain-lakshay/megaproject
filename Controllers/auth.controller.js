 import User from '../models/user.schema'
 import asyncHandler from '../services/asyncHandler'
 import CustomError from '../utils/customError'
import mailHelper from '../utils/mailHelper'
import crypto from 'crypto'

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
const user = await User.findOne({email}).select("+password")//read documentation moongoose select
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

 /******************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:5000/api/auth/password/forgot
 * @description User will submit email and we will generate a token
 * @parameters  email
 * @returns success message - email send
 ******************************************************/

 export const forgotPassword= asyncHandler (async (req,res)=>{
 const {email}=req.body
 const user =  await User.findOne({email})

 if (!user){
   throw new CustomError('error user not found',404)
 }
//reset token
  const resetToken=user.generateForgotPasswordToken()
   await user.save({validateBeforeSave: false})

    const resetUrl=
    `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

const text =`your password reset url is  /n/n ${resetUrl}/n/n`

    try {
      
await mailHelper({

   email:user.email,
   subject:"password reset email for website",
   text:text,
})
res.status(200).json({
   success:true,
   message:`email send to ${user.email}`
})
    } catch (err) {
//role back clear fields and save
user.forgotPasswordToken=undefined
user.forgotPasswordExpiry=undefined

await user.save({validateBeforeSave:false})

      throw new CustomError(err.message||'email sent failure',500)
    }
 })

 /******************************************************
 * @RESET_PASSWORD
 * @route http://localhost:5000/api/auth/password/reset/:resetToken
 * @description User will be able to reset password based on url token
 * @parameters  token from url, password and confirmpass
 * @returns User object
 ******************************************************/
export const resetPassword = asyncHandler(async(req,res)=>{
   const {token:resetToken}=req.params
   const {password,confirmPassword}=req.body

   const resetPasswordToken=crypto
   .createHash('sha256')
   .update(resetToken)
   .digest(hex)

  const user=  await User.findOne({
      forgotPasswordToken:resetPasswordToken,
      forgotPasswordExpiry:{$gt: Date.now()}
   });
   if(!user){
      throw  new CustomError('password token is expired or invalid',400)
   }
   if(password!== confirmPassword){
      throw new CustomError('password and confirm password should be same',400)
   }

   user.password=password
   user.forgotPasswordToken=undefined
   user.forgotPasswordExpiry=undefined

   await user.save()
})


    //create token and send as response
    const token = user.getJwtToken()
    user.password=undefined;

    res.cookie('token',token,cookieOptions)

res.status(200).json({
   success:true
})


/******************************************************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:5000/api/auth/profile
 * @description check for token and populate req.user
 * @parameters 
 * @returns User Object
 ******************************************************/
export const getProfile = asyncHandler(async(req, res) => {
   const {user} = req
   if (!user) {
       throw new CustomError('User not found', 404)
   }
   res.status(200).json({
       success: true,
       user
   })
})