import {asyncHandler} from "../utilis/asynchandler.js"
import {ApiError} from "../utilis/apierror.js"
import { uploadonCloudinary } from "../utilis/cloudnary.js"
import {ApiResponse} from"../utilis/apiresponse.js"
import {connectDatabase} from "../backend/database.js"
import { decodeToken } from "../utilis/jwt.js"
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
        const insertString = `insert into adoption_agency(agency_id,aname,user_id,address,email,phone_no,website,LICSENCE_NO,access_token) values (agency_seq.nextval,'${agencyName}',${id},'${address}','${is_mail.rows[0]}',${is_no.rows[0]},'${websitelink}','${licno}','${token}')`
        const result = await connection.execute(insertString)
        await connection.commit()
        res.status(200).json(
            new ApiResponse(200,'Agency Registered')
        )
    }catch(err){
        throw new ApiError(401,err)
    }
})
export {getAgencyDetials}