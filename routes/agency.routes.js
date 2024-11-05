import {Router} from 'express'
import { addCoverImage, getAgencyDetials, showAgencyDetails,addavatar} from '../controllers/agency.controllers.js'
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
export default agencyRouter;