import express from "express";
import * as controller from "../controllers/user"
import { authMiddleware} from '../middleware/auth.middleware';
import { upload, messageUpload } from "../middleware/multer.middleware";

const router = express.Router();
router.use(express.json());

//FAI UN CONTROLLER PER OGNI END-POINT
router.get("/getUser/:username",[authMiddleware], controller.getUser);
router.post("/updatePhoto", [authMiddleware, upload], controller.updatePhoto);
router.post("/handleFollow", [authMiddleware], controller.handleFollow);
router.get("/:username/following", [authMiddleware], controller.isFollowing);
router.post("/createThread", [authMiddleware], controller.createThread);
router.post("/like", [authMiddleware], controller.handleLike);
router.post("/dislike", [authMiddleware], controller.handleDislike);
router.get("/likeStatus/:entityType/:entityId", [authMiddleware], controller.checkLikeStatus);
router.post("/createMessage/:threadId", [authMiddleware, messageUpload], controller.createMessage);
router.post("/uploadMessageImage/:messageId", [authMiddleware, messageUpload], controller.uploadMessageImage);
router.post('/createComment/:messageId/', [authMiddleware], controller.createComment);

export {router};