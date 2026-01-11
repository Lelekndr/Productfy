import {Router} from "express";
import { syncUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";


const router = Router();

//POST /api/users/sync - Sync user data (protected) - sync clerk with DB
router.post("/sync",requireAuth(), syncUser);

export default router;

