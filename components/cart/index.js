import express from 'express'
import commonUtils from '../../utils/commonUtils.js'
import routes from './routes.js'

const router = express.Router()
commonUtils.routeArray(routes, router)

export default router