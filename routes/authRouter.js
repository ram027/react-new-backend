import { Router } from "express";
import { signUp, login } from "../controllers/authController";

const router = Router();

// endpoints for auth
router.post("/signup", signUp);

router.post("/login", login);

export default router;
