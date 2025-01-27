import { Router } from "express";
import { upload } from "../middlerware/multer.middleware.js";
import {registerUser,loginUser,
    getAccountDetail,logoutUser,
    recommendedchild} from "../controllers/user.controllers.js"
const router = Router()
router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount:1
    }
]),registerUser)
router.route("/login").post(loginUser)
router.route("/account").get(getAccountDetail)
router.route("/account").post(logoutUser)
router.route("/recomendation").get(recommendedchild)
export default router;