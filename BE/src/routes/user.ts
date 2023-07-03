import express from "express";
import * as controller from "../controllers/user"
import { authMiddleware} from '../middleware/auth.middleware';
import { upload } from "../middleware/multer.middleware";

const router = express.Router();
router.use(express.json());

//FAI UN CONTROLLER PER OGNI END-POINT
router.get("/getUser/:username",[authMiddleware], controller.getUser);
router.post("/updatePhoto", [authMiddleware, upload], controller.updatePhoto);
router.post("/:id/follow", [authMiddleware], controller.follow);
router.post("/:id/unfollow", [authMiddleware], controller.unfollow);
router.get("/:username/following", [authMiddleware], controller.isFollowing);

export {router};