import { asyncHandler } from "../utilis/asynchandler.js";
import { ApiError } from "../utilis/apierror.js";
import { ApiResponse } from "../utilis/apiresponse.js";
import { connectDatabase } from "../backend/database.js";
import { uploadonCloudinary } from "../utilis/cloudnary.js";
import { decodeAgencyToken } from "../utilis/jwt.js";
const connection = await connectDatabase();
const getChildDetails = asyncHandler( async(req,res)=>{
try {
        const token = req.cookies?.AgencyToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log('Agency Token :',token);
        const agencyId = decodeAgencyToken(token)._id;
        console.log(agencyId);
        const {cname,gender,cdob,description,status,hobby} = req.body;
        let photo;
        if(req.files && Array.isArray(req.files.photp) && req.files.photo.length>0){
            photo = req.files.photo[0].path;
        }
        if([cname,gender,cdob,status].some((filed)=>{
                filed?.trim()==""
        })){
            throw new ApiError(401,"All this filed is required");
        }
        console.log("Photo: ",photo)
        if(photo){
            const cloudinaryResponse = await uploadonCloudinary(photo);
            console.log("CResponse :",cloudinaryResponse);
            const photo_url = cloudinaryResponse.url;
        }
        const insert_string = `insert into child(cid,cname,cdob,date_of_entry,description,status,hobby,photo,agency_id) values (child_seq.nextval,${cname},${cdob},to_date(sysdate,'DD-MON-YYY'),${description},${status},${hobby},${photo_url},${agencyId})`;
        const insertRecord = await connection.execute(insert_string);
        console.log(insertRecord);
        await connection.commit();
        option = {
            httpOnly :true,
            secure:true
        }
        res.status(201).json(
            new ApiResponse(200,{cname},"Child Added Sucessfully")
        )
        
} catch (error) {
    throw new ApiError(402,error)
}
});

export {getChildDetails}