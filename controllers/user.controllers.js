import {asyncHandler} from "../utilis/asynchandler.js"
import {ApiError} from "../utilis/apierror.js"
import { uploadonCloudinary } from "../utilis/cloudnary.js"
import {ApiResponse} from"../utilis/apiresponse.js"
import {connectDatabase} from "../backend/database.js"
import { generateRefreshToken,generateAccessToken } from "../utilis/jwt.js"
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
    res.status(200).cookie("Refresh Token",refreshToken,option)
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
    if(user_id.rows.length==0){
        throw new ApiError(404,'wrong Username')
    }
   const CHECK_PASSWORD = `select password from users where user_id = ${user_id}`
   const passcode = connection.execute(CHECK_PASSWORD)
   if(passcode == password){
    const user_email = `select email from users where user_id = ${user_id}`
    const email = connection.execute(user_email)
    const accessToken = generateAccessToken(user_id,username,email)
    const fetch_refreshToken = `select refresh_token from users where user_id = ${user_id}`
    const refreshToken = connection.execute(fetch_refreshToken)
    const insertString = `insert into loginuser values(${user_id},'${accessToken}','${refreshToken}')`
    await connection.execute(insertString)
    res.status(200).cookie(accessToken,option).cookie(refreshToken,option).json(
         new ApiResponse(200,{
            user_id
         },"User Logged in succesfully")
    )
    
   }

   }catch(err){
    console.log(err)
    throw new ApiError(401,"something Went wrong")
   }

})
export {registerUser,loginUser}