import express from "express";
import * as controller from "../controllers/user"
import { authMiddleware} from '../middleware/auth.middleware';
import { upload } from "../middleware/multer.middleware";

const router = express.Router();
router.use(express.json());

//FAI UN CONTROLLER PER OGNI END-POINT
router.get("/getUser",[authMiddleware], controller.getUser);
router.post("/updatePhoto", [upload], controller.updatePhoto);

export {router};