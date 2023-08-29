import express from "express";
import * as threadController from "../controllers/thread"
import { authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(express.json());

router.get('/getTenThreadsFollowingAndPropriate', [authMiddleware], threadController.getTenThreadsFollowingAndPropriate);

export {router};