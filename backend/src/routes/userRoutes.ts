import {Router} from "express";
import { syncUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";


const router = Router();

//protect
router.post("/sync",requireAuth(), syncUser);

export default router;

