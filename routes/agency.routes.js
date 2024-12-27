import {Router} from 'express'
import { addCoverImage, getAgencyDetials, showAgencyDetails,addavatar,
    isagencyUser,showChildren
} from '../controllers/agency.controllers.js'
import { upload } from '../middlerware/multer.middleware.js'
const agencyRouter = Router()
agencyRouter.route('/agency').post(getAgencyDetials)
agencyRouter.route('/agencyDetails').get(showAgencyDetails)
agencyRouter.route('/uploadCoverImage').post(upload.fields([
    {
        name: "cimage",
        maxCount :1
    }
]),addCoverImage)
agencyRouter.route('/uploadavatar').post(upload.fields([
    {
        name :'avatar',
        maxCount:1
    }
]),addavatar)
agencyRouter.route('/agencyemailverification').post(isagencyUser)
agencyRouter.route('/getchildren').get(showChildren)
export default agencyRouter;