import { Router } from "express";
import {getChildDetails} from "../controllers/child.controllers.js";
import { upload } from "../middlerware/multer.middleware.js";
const childRouter = Router();
childRouter.route('/childform').post(upload.fields([
    {
        name:"photo",
        maxCount:1
    }
]),getChildDetails);
export default childRouter;

