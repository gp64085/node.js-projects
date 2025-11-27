import express, { json } from "express";
import "dotenv/config";

import authorRouter from "./routes/author.routes.js";
import bookRouter from "./routes/books.routes.js";
import userRouter from "./routes/user.routes.js";
import { loggingMiddleware } from "./middlewares/logger.js";
import adminRouter from "./routes/admin.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";

const PORT = 4000;

// Initialize Express app
const app = express();

// Middlewares
app.use(json());
app.use(loggingMiddleware);
app.use(authenticationMiddleware);

// Router
app.use("/books", bookRouter);
app.use("/authors", authorRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
