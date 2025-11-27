import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import {
  authenticationMiddleware,
  authorizedMiddleware,
  ensureAuthenticated,
} from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.use(
  authenticationMiddleware,
  ensureAuthenticated,
  authorizedMiddleware("ADMIN"),
);

adminRouter.get("/users", getUsers);

export default adminRouter;
