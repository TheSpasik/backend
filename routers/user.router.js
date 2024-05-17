import userController from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.post("/change-subscription", userController.changeSubscription);

export default router;