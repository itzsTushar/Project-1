import { Router } from "express";
import {getChildDetails, recommendRandomChildren} from "../controllers/child.controllers.js";
import { upload } from "../middlerware/multer.middleware.js";
const childRouter = Router();
childRouter.route('/childform').post(getChildDetails);
export default childRouter;

