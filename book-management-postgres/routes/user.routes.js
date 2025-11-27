import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controller.js";
import {
  authenticationMiddleware,
  ensureAuthenticated,
} from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.get(
  "/me",
  authenticationMiddleware,
  ensureAuthenticated,
  getCurrentUser,
);
userRouter.put("/", authenticationMiddleware, ensureAuthenticated, updateUser);

export default userRouter;
