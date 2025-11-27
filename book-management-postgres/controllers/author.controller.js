import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { authorTable } from "../models/author.model.js";

export const getAllAuthors = async (_req, res) => {
  return res.json(await db.select().from(authorTable));
};

export const getAuthorById = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Invalid ID" });

  const [author] = await db
    .select()
    .from(authorTable)
    .where(eq(authorTable.id, id))
    .limit(1);

  if (!author) return res.status(404).json({ error: "Author not found" });

  return res.json(author);
};

export const createAuthor = async (req, res) => {
  const { name, email } = req.body;

  if (!name) return res.status(400).json({ error: "Invalid name" });
  if (!email || !email.includes("@"))
    return res.status(400).json({ error: "Invalid email" });

  const [result] = await db
    .insert(authorTable)
    .values({ name, email })
    .returning({ id: authorTable.id });

  return res
    .status(201)
    .json({ message: "Author created successfully", id: result.id });
};

export const updateAuthor = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) return res.status(400).json({ error: "Invalid ID" });
  if (!name) return res.status(400).json({ error: "Invalid name" });

  const [result] = await db
    .update(authorTable)
    .set({ name })
    .where(eq(authorTable.id, id))
    .returning({ id: authorTable.id });

  if (!result) return res.status(404).json({ error: "Author not found" });

  return res.json({ message: "Author updated successfully", id: result.id });
};

export const deleteAuthor = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Invalid ID" });

  const [author] = await db
    .delete(authorTable)
    .where(eq(authorTable.id, id))
    .returning({ id: authorTable.id });

  if (!author) return res.status(404).json({ error: "Author not found" });

  return res.json(author.id);
};
