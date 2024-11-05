import {asyncHandler} from "../utilis/asynchandler.js"
import {ApiError} from "../utilis/apierror.js"
import { uploadonCloudinary } from "../utilis/cloudnary.js"
import {ApiResponse} from"../utilis/apiresponse.js"
import {connectDatabase} from "../backend/database.js"
import { generateAgencyToken,decodeToken,decodeAgencyToken } from "../utilis/jwt.js"
import { decode } from "jsonwebtoken"
const connection = await connectDatabase()
const getAgencyDetials = asyncHandler(async(req,res)=>{
    try{
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "")
        const decoded_token = decodeToken(token)
        const id =decoded_token._id
        console.log('id:',id)
        const {agencyName,address,websitelink,licno} = req.body
        if([agencyName,address,licno].some((filed)=>{
            filed?.trim()==""
        })){
            throw new ApiError(400,"All fileds are required")
        }
      /*  if(!websitelink){
            websitelink = null
        }*/
        console.log('Agency Name',agencyName)
        console.log(websitelink,licno)
       // console.log('email :',email)
        const check_mail = `select email from users where user_id = ${id}`
        const is_mail = await connection.execute(check_mail)
        if(is_mail.rows.length==0){
            throw new ApiError(401,'email not found')
        }
        const check_no = `select phno from users where user_id = ${id}`
        const is_no = await connection.execute(check_no)
        if(is_no.rows.length==0){
            throw new ApiError(401,'phno not found')
        }
        console.log(is_mail.rows[0])
        console.log(is_no.rows[0])
        const agencyToken = generateAgencyToken(id,agencyName,licno)
        const insertString = `insert into adoption_agency(agency_id,aname,user_id,address,email,phone_no,website,LICSENCE_NO,access_token,agency_token) values (agency_seq.nextval,'${agencyName}',${id},'${address}','${is_mail.rows[0]}',${is_no.rows[0]},'${websitelink}','${licno}','${token}','${agencyToken}')`
        const result = await connection.execute(insertString)
        await connection.commit()
        const option ={
            httpOnly:true,
            secure:true
        }
        res.status(200).cookie('AgencyToken',agencyToken,option).json(
            new ApiResponse(200,'Agency Registered')
        )
    }catch(err){
        throw new ApiError(401,err)
    }
})
const showAgencyDetails = asyncHandler(async(req,res)=>{
try {
        const token = req.cookies?.AgencyToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(token)
        if(!token){
            throw new ApiError(401,"'unauthirised req")
        }
        const decoded_token = decodeAgencyToken(token)
        const id = decoded_token._id
        console.log(id)
        const agencyString = `select *from adoption_agency where user_id=${id}`
        const result = await connection.execute(agencyString)
        if(result.rows.length == 0){
            throw new ApiError(404,'No agency found')
        }
        console.log(result.rows[0])
        const detail = result.rows[0]
        res.status(200).json(
            new ApiResponse(200,{detail},'Agency Details')
        )
} catch (error) {
    console.log('SomeThing went wrong : ',error)
}
})
const addCoverImage = asyncHandler(async(req,res)=>{
    //get Token 
    const token = req.cookies?.AgencyToken || req.header("Authorization")?.replace("Bearer ","")
    console.log("agency Token chehck in cimgae",token)
    //fetch id
    const decoded_token = decodeAgencyToken(token)
    const id = decoded_token._id
    console.log(id)
    //get image 
    let cimage
    console.log(req.files)
    if(req.files && Array.isArray(req.files.cimage)&& req.files.cimage.length>0){
        cimage=req.files.cimage[0].path
    }
    console.log(cimage)
    if(!cimage){
        throw new ApiError(404,'image path not exist')
    }
    // upload on cloudinary
    //get link from cloudinary
    const uploader = await uploadonCloudinary(cimage)
    const url = uploader.url
    console.log(url)
    //update the agency table
    const updateString = `UPDATE adoption_agency SET cimage = '${url}' WHERE user_id = ${id}`
    const result = await connection.execute(updateString)
    console.log(result)
    /*if(result.rows.length==0){
        throw new ApiError(404,'update failed')
    }*/
    await connection.commit()
    // send the response
    res.status(201).json(
        new ApiResponse(201,"Update successful")
    )
})
const addavatar = asyncHandler(async(req,res)=>{
    //get the token
    const token=  req.cookies?.AgencyToken || req.header("Authorization")?.replace('Bearer ','')
    console.log(token)
    //fetch id
    const decoded_token = decodeAgencyToken(token)
    const id = decoded_token._id
    console.log(id)
    //getImage
    let avatar
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatar = req.files.avatar[0].path
    }
    if(!avatar){
        throw new ApiError(401,'avatar not found')
    }
    // upload on cloudinary 
    const uploader = await uploadonCloudinary(avatar)
    // fetch url
    const url = uploader.url
    //upload in database
    const uploadString = `UPDATE ADOPTION_AGENCY SET AVATAR = '${url}' WHERE USER_ID = ${id}`
    const result = await connection.execute(uploadString)
    
    //commit
    await connection.commit()
    res.status(201).json(
        new ApiResponse(201,'Avatar Uploaded')
    )
})
export {getAgencyDetials,showAgencyDetails,addCoverImage,addavatar}