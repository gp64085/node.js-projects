import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { userTable, userSessionTable } from "../models/user.model.js";
import { randomBytes, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";

export const getUsers = async (_req, res) => {
  try {
    const users = await db.select().from(userTable);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if email already exists
    const [existingUser] = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where((table) => eq(table.email, email))
      .limit(1);

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = generateSalt();
    const hashedPassword = generateHashedPassword(password, salt);

    const [result] = await db
      .insert(userTable)
      .values({ email, password: hashedPassword, name, salt })
      .returning({ id: userTable.id });
    return res
      .status(201)
      .json({ message: "User created successfully", id: result.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        salt: userTable.salt,
        password: userTable.password,
        role: userTable.role,
      })
      .from(userTable)
      .where((table) => eq(table.email, email))
      .limit(1);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email '${email}' not exists` });
    }

    const hashedPassword = generateHashedPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Session based authentication
    // const [userSession] = await db
    //   .insert(userSessionTable)
    //   .values({ userId: user.id })
    //   .returning({ id: userSessionTable.id });
    //
    // return res.status(200).json({ message: "Login successful", sessionId: userSession.id });

    // Stateless (JWT) authentication
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  const userData = req.user;

  const [user] = await db
    .select({ id: userTable.id, email: userTable.email, name: userTable.name })
    .from(userTable)
    .where(eq(userTable.id, userData.userId));
  return res.status(200).json({ message: "Success", user });
};

export const updateUser = async (req, res) => {
  const user = req.user;

  const { name, password } = req.body;

  const salt = generateSalt();
  const [updatedUser] = await db
    .update(userTable)
    .set({ name, password: generateHashedPassword(password, salt), salt })
    .where(eq(userTable.id, user.userId))
    .returning({ id: userTable.id });

  return res
    .status(200)
    .json({ message: "User updated successfully", id: updatedUser.id });
};

function generateSalt() {
  return randomBytes(256).toString("hex");
}

function generateHashedPassword(password, salt) {
  if (!password || !salt) {
    return null;
  }
  return createHmac("sha256", salt).update(password).digest("hex");
}
