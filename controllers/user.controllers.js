import {asyncHandler} from "../utilis/asynchandler.js"
import {ApiError} from "../utilis/apierror.js"
import { uploadonCloudinary } from "../utilis/cloudnary.js"
import {ApiResponse} from"../utilis/apiresponse.js"
import {connectDatabase} from "../backend/database.js"
import { generateRefreshToken,generateAccessToken,decodeToken} from "../utilis/jwt.js"
const connection = await connectDatabase()
const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,phno,password} = req.body
    let avatar_path
    if(req.files && Array.isArray(req.files.avatar)&& req.files.avatar.length>0){
        avatar_path=req.files.avatar[0].path
    }
    console.log("username : ",username)
    console.log("email : ",email)
    console.log("phno : ",phno)
    console.log("Password : ",password)
    console.log("avatar",avatar_path)
    if([username,email,phno,password].some((filed)=>{
        filed?.trim()==""
    })){
        throw new ApiError(400,"All fileds are required")
    }
    let avatar = null   
    if(avatar_path){
       const avatarUrl = await uploadonCloudinary(avatar_path)
       avatar = avatarUrl.url
        console.log("avatar url :",avatarUrl.url)
    }
   
    const CHECK_USER = `select user_id from users where username = '${username}'`
    const is_user = await connection.execute(CHECK_USER)
    console.log(is_user.rows)
    //let whenEntry = []
    if(is_user.rows.length != 0){
        throw new ApiError(409,'UserName is already exists')
    }
    const CHECK_MAIL = `select user_id from users where email = '${email}'`
    const is_mail = await connection.execute(CHECK_MAIL)
    //console.log(is_mail)
    if(is_mail.rows.length != 0){
        throw new ApiError(409,'Email is alreday in used')
    }
    const CHECK_NO = `select user_id from users where phno = '${phno}'`
    const is_no = await connection.execute(CHECK_NO)
    //console.log(is_no)
    if(is_no.rows.length != 0){
        throw new ApiError(409,'Phone number is alreday in used')
    }
    let refreshToken,option
    if(is_user.rows.length=== 0 && is_mail.rows.length=== 0&& is_no.rows.length=== 0){
        refreshToken = generateRefreshToken(phno, username, email);
        console.log(refreshToken);
        //console.log(avatarUrl)
        // Use bind variables to safely insert values into the SQL query
        /*const insert_string = `INSERT INTO users VALUES (user_seq.nextval, :username, :email, :phno, :refreshToken, :avatarUrl, :password)`;
        
        const insertRecord = await connection.upload(insert_string, {
            username: username,
            email: email,
            phno: phno,
            refreshToken: refreshToken,
            avatarUrl: avatarUrl,
            password: password
        });*/
        const insert_string = `insert into users values (user_seq.nextval,'${username}','${email}','${phno}','${refreshToken}','${avatar}','${password}')`
        const insertRecord = await connection.execute(insert_string)
        console.log(insertRecord);
        // Commit the transaction (if required)
        await connection.commit();
        option ={
            httpOnly : true,
            secure : true
        }
    }
    else{
        throw new ApiError(404,'Something went wrong while inserting the data')
    }
    res.status(200).cookie("signRefreshToken",refreshToken,option)
    .json(
        new ApiResponse(200,{username,email},'User Register Succesfully')
    )
})
const loginUser=asyncHandler(async(req,res)=>{
   try{
    const {username,password} = req.body
    console.log("USername: ",username)
    console.log("password : ",password)
    const CHECK_USER = `select user_id from users where username = '${username}'`
    const user_id = await connection.execute(CHECK_USER)
    console.log(user_id.rows[0])
    if(user_id.rows.length==0){
        throw new ApiError(404,'wrong Username')
    }
   const CHECK_PASSWORD = `select password from users where user_id = ${user_id.rows[0]}`
   const passcode = await connection.execute(CHECK_PASSWORD)
   console.log(passcode.rows[0])
   if(passcode.rows[0] == password){
    const user_email = `select email from users where user_id = ${user_id.rows[0]}`
    const email = await connection.execute(user_email)
    const accessToken = generateAccessToken(user_id.rows[0],username,email.rows[0])
    const fetch_refreshToken = `select refresh_token from users where user_id = ${user_id.rows[0]}`
    const refreshToken = await connection.execute(fetch_refreshToken)
    const insertString = `insert into loginuser values(${user_id.rows[0]},'${accessToken}','${refreshToken.rows[0]}')`
    await connection.execute(insertString)
    await connection.commit()
    const option = {
        httpOnly:true,
        secure:true
    }
    res.status(200).cookie("AccessToken",accessToken,option).cookie("RefreshToken",refreshToken.rows[0],option).json(
         new ApiResponse(200,{
            user_id
         },"User Logged in succesfully")
    )
    
   }
   else{
    throw new ApiError(404,"Password is incorrect")
   }

   }catch(err){
    console.log(err)
    throw new ApiError(401,"something Went wrong")
   }

})
const getAccountDetail = asyncHandler(async(req,res)=>{
    const cookie = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "")
    //const cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOlsyM10sInVzZXJuYW1lIjoic2hhcm1hdHVzaGFyIiwiZW1haWwiOlsia3M2MDY0MTMzQGdtYWlsLmNvbSJdLCJpYXQiOjE3Mjg5Nzc2NjMsImV4cCI6MTcyOTA2NDA2M30.fBAYhzGJREuF3ky_iQ1I755irxJYJRRBIuP8e3j7zHQ'
    console.log(cookie)
    const decoded_token = decodeToken(cookie)
    const id =decoded_token._id
    console.log(id)
    const updateString = `select user_id,username,email,phno,avatar from users where user_id = ${id}` 
    const result = await connection.execute(updateString)
    if(result.rows.length == 0){
        throw new ApiError(401,"unauthorised request")
    }
   const  details = result.rows[0]
    //console.log(result.rows[0])
    //console.log(user_id,username)
    res.status(200).json(
        new ApiResponse(200, {details},"details of the user")
    )
})
const logoutUser = asyncHandler(async(req,res)=>{
 //fecth the cookie if not throw error 
 //decode the id
 // delte the user from login table
 // clear the cookie res.clearcookie()
 //commit the database
 const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","")
 if(!token){
    throw new ApiError(404,"Unauthorised")
 }
 console.log(token)
 const decoded_token = decodeToken(token)
 const id = decoded_token._id
 const deleteString = `delete from loginuser where user_id = ${id}`
 const result = await connection.execute(deleteString)
 await connection.commit()
 res.status(200).clearCookie("AccessToken").clearCookie("Refreshtoken").json(
    new ApiResponse(200,"USer logged out")
 )
})
//await connection.close()
export {registerUser,loginUser,getAccountDetail,logoutUser}