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
        const userId = decodeAgencyToken(token)._id;
        const agencyString = `select agency_id from adoption_agency where user_id=${userId}`;
        const agencyId = await connection.execute(agencyString);
        if(agencyId.rows.length==0) throw new ApiError(400,"invalid agency");
        console.log(agencyId.rows[0]);
        const {cname,gender,cdob,description,status,hobby} = req.body;
        console.log(req.body);
        if([cname,gender,cdob,status].some((filed)=>{
                filed?.trim()==""
        })){
            throw new ApiError(401,"All this filed is required");
        }
        const insert_string = `insert into child(cid,cname,gender,cdob,date_of_entry,description,status,hobby,agency_id) values (child_seq.nextval,'${cname}','${gender}',to_date('${cdob}','yyyy-mm-dd'),sysdate,'${description}','${status}','${hobby}',${agencyId.rows[0]})`;
        console.log(insert_string);
        const insertRecord = await connection.execute(insert_string);
        console.log(insertRecord);
        await connection.commit();
        const option = {
            httpOnly :true,
            secure:true
        }
        res.status(201).json(
            new ApiResponse(200,{cname},"Child Added Sucessfully")
        )
        
} catch (error) {
    throw new ApiError(400,error)
}
});
const recommendRandomChildren = asyncHandler(async(req,res)=>{
try{
    const fetchChildString = `select cname,(sysdate-cdob)/365,status,photo from child where rownum<=20`
    const children_detail = await connection.execute(fetchChildString)
    let len = children_detail.rows.length;
    if (len==0) throw new ApiError(401,'No Data Available')
    const childArray = [];
    for(let i=0;i<n ; i++){
        childArray.push(children_detail.rows[i]);
    }
    const transformedArray = childArray.map(([name, age, status, photo]) => ({
        name,
        age,
        status,
        photo,
      }))
      console.log(transformedArray)
      res.status(200).json(
        new ApiResponse(200,transformedArray,"Sucessful")
    )
}catch(err){
    console.log('Something Went Wrong ->>',err)
}
})
export {getChildDetails,recommendRandomChildren}