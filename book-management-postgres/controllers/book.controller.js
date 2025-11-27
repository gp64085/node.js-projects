import { eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookTable } from "../models/book.model.js";
import { authorTable } from "../models/author.model.js";

export const getAllBooks = async (req, res) => {
  const { search } = req.query;

  if (search) {
    return res.status(200).json(
      await db
        .select()
        .from(bookTable)
        .where(ilike(bookTable.title, `%${search}%`)),
    );
  }
  return res.status(200).json(await db.select().from(bookTable));
};
export const getBookById = async (req, res) => {
  const id = req.params.id;

  if (!id)
    return res.status(400).json({
      message: `The id ${req.params.id} is not a valid number.`,
    });

  const [book] = await db
    .select()
    .from(bookTable)
    .where((table) => eq(table.id, id))
    .leftJoin(authorTable, eq(bookTable.authorId, authorTable.id))
    .limit(1);

  if (!book)
    return res.status(404).json({
      message: `The book with the given ID ${req.params.id} was not found.`,
    });
  res.status(200).json(book);
};

export const addBook = async (req, res) => {
  const { title, authorId, description } = req.body;

  if (!title || !title.trim())
    return res.status(400).json({
      message: `The title is required.`,
    });

  if (!authorId || !authorId.trim())
    return res.status(400).json({
      message: `The author is required.`,
    });

  const isBookExists =
    (await db.select().from(bookTable).where(eq(bookTable.title, title)))
      .length > 0;

  if (isBookExists)
    return res.status(400).json({
      message: `The book with the given title '${title}' already exists.`,
    });

  const book = {
    title,
    authorId,
    description,
  };

  const [result] = await db
    .insert(bookTable)
    .values(book)
    .returning({ id: bookTable.id });

  res.status(201).json({ message: "Book created successfully", id: result.id });
};

export const deleteBookById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(400).json({
      message: `The id ${req.params.id} is not a valid number.`,
    });

  const isBookExists = (
    await db.select().from(bookTable).where(eq(bookTable.id, id))
  ).length;

  if (isBookExists === 0)
    return res.status(404).json({
      message: `The book with the given ID ${req.params.id} was not found.`,
    });

  const deletedBook = await db
    .delete(bookTable)
    .where(eq(bookTable.id, id))
    .returning();

  res.status(200).json({ message: "Book deleted successfully", deletedBook });
};
