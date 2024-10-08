import jwt from "jsonwebtoken"
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
export{
    generateRefreshToken,
    generateAccessToken
}