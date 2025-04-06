import {Router} from "express";
import authRouter from './auth.js';
import reviewRouter from './reviewroute.js'

const router = Router();
router.use('/', authRouter);

router.use('/', reviewRouter);

export default router;
