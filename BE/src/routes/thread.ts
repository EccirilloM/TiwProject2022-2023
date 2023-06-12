import express from "express";
import * as threadController from "../controllers/thread"
import { authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(express.json());

router.get('/following', authMiddleware, threadController.getAllThreadsFollowingAndPropriate);

export {router};