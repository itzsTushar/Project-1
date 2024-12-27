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

/*
const getChildDetails = asyncHandler(async (req, res) => {
    try {
        const token = req.cookies?.AgencyToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log('Agency Token: [MASKED]');
        
        let agencyId;
        try {
            agencyId = decodeAgencyToken(token)._id;
        } catch (err) {
            throw new ApiError(401, "Invalid or missing token");
        }

        const { cname, gender, cdob, description, status, hobby } = req.body;
        console.log(req.body);
        if ([cname, gender, cdob, status].some((field) => !field?.trim())) {
            throw new ApiError(401, "All required fields must be filled out");
        }

        const insert_string = `INSERT INTO child (cid, cname, cdob, date_of_entry, description, status, hobby, agency_id)
            VALUES (child_seq.nextval, :cname, TO_DATE(:cdob, 'YYYY-MM-DD'), SYSDATE, :description, :status, :hobby, :agencyId)`;

        const bindParams = {
            cname: cname.trim(),
            cdob: cdob.trim(),
            description: description.trim(),
            status: status.trim(),
            hobby: hobby.trim(),
            agencyId
        };

        const insertRecord = await connection.execute(insert_string, bindParams, { autoCommit: true });
        console.log("Insert Record:", insertRecord);

        res.status(201).json(new ApiResponse(200, { cname }, "Child Added Successfully"));
    } catch (error) {
        console.error("Error adding child:", error);
        res.status(400).json(new ApiError(400, error.message || "An error occurred"));
    }
});
*/

/*async function fetchChildren() {
        try {
            const response = await fetch('/getChildren', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch children');
            }

            const children = await response.json();
            const childrenContainer = document.getElementById('childrenContainer');
            childrenContainer.innerHTML = ''; // Clear existing cards

            children.forEach((child) => {
                const childCard = `
                    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
                        <div class="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
                            <img src="${child.photo || 'default_child_photo.jpg'}" alt="${child.name}" class="w-full h-full object-cover">
                        </div>
                        <h2 class="mt-4 text-lg font-semibold text-gray-800">${child.name}</h2>
                        <p class="text-gray-600">Status: ${child.status}</p>
                        <p class="text-gray-600">Age: ${child.age}</p>
                        <label class="mt-4 block">
                            <input type="file" class="hidden">
                            <span class="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer">Upload Photo</span>
                        </label>
                    </div>
                `;
                childrenContainer.innerHTML += childCard; // Append the new card
            });
        } catch (err) {
            console.error(err);
        }
    }*/
export {getChildDetails}