import express from "express";
import * as threadController from "../controllers/thread"
import { authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(express.json());

router.get('/followingAndOwn', [authMiddleware], threadController.getTenThreadsFollowingAndPropriate);
router.get('/:threadId/info', [authMiddleware], threadController.getThreadInfo);
router.get('/:threadId/messages', [authMiddleware], threadController.getThreadMessages);
router.get('/getMessageComments/:messageId', [authMiddleware], threadController.getMessageComments);

export {router};