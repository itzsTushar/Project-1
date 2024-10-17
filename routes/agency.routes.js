import {Router} from 'express'
import { getAgencyDetials } from '../controllers/agency.controllers.js'
const agencyRouter = Router()
agencyRouter.route('/').post(getAgencyDetials)
export default agencyRouter;