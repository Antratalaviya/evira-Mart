import express from 'express';
import commonUtils from '../../utils/commonUtils.js';
import routeArr from "./route.js";

const router = express.Router();

commonUtils.routeArray(routeArr, router)

export default router