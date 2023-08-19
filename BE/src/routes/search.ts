import express from "express";
import * as controller from "../controllers/search"
import { authMiddleware} from '../middleware/auth.middleware';

const router = express.Router();
router.use(express.json());

router.get('/user', [authMiddleware], controller.searchUsers);
router.get('/thread', [authMiddleware], controller.searchThread);
router.get('/randomUsers', [authMiddleware], controller.getTenRandomUsers);
router.get('/randomThreads', [authMiddleware], controller.getTenRandomThreads);


export {router};