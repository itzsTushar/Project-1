import jwt from "jsonwebtoken"
import { ApiError } from "./apierror.js"
const generateRefreshToken = function(id,username,email){
    try{
        return jwt.sign({
            _id : id,
             username : username,
            email:email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        })
    }
    catch(err){
        console.log("Something Went Wrong",err)
    }
}
const generateAccessToken = function(user_id,username,email){
    try{
        return jwt.sign({
            _id : user_id,
            username:username,
            email:email
        },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY   
    })
    }catch(err){
        console.log("Something Went wrong",err)
    }
}
const decodeToken = function(token){
    try{
        if(!token){
            throw new ApiError(401,"Unauthorised request")
        }
        const decode_token = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        return decode_token
    }
    catch(err){
        console.error(err)
    }
}
export{
    generateRefreshToken,
    generateAccessToken,
    decodeToken
}