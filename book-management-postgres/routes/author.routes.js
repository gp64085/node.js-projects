import { Router } from "express";
import {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
} from "../controllers/author.controller.js";

const router = Router();

router.get("/", getAllAuthors);
router.post("/", createAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);
router.get("/:id", getAuthorById);

export default router;
