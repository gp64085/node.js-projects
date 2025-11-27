import { Router } from "express";
import {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", ensureAuthenticated, getCurrentUser);
userRouter.patch("/", ensureAuthenticated, updateUser);

export default userRouter;
