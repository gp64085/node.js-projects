import dotenv from "dotenv";
import connect from "./db/connection.js";
import express, { json } from "express";
import userRouter from "./routes/user.routes.js";
import { authenticateMiddleware } from "./middlewares/authentication.middleware.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to MoongoDB
await connect(DATABASE_URL);

app.use(json());
app.use(authenticateMiddleware);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
