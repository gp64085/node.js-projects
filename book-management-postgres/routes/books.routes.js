import { Router } from "express";

import {
  getAllBooks,
  getBookById,
  addBook,
  deleteBookById,
} from "../controllers/book.controller.js";

// Router
const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.get("/:id", getBookById);
bookRouter.post("/", addBook);
bookRouter.delete("/:id", deleteBookById);

export default bookRouter;
