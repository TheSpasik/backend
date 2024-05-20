import userController from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.post("/change-subscription", userController.changeSubscription);
router.post("/change-bio", userController.changeBio);

export default router;