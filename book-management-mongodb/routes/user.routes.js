import { Router } from "express";
import {
  createUser,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  authenticateMiddleware,
  ensureAuthenticated,
} from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/", ensureAuthenticated, getUsers);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.patch("/", ensureAuthenticated, updateUser);

export default router;
