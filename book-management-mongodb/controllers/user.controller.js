import User from "../models/user.model.js";
import { generateHashedValue, generateSalt } from "../utils/index.js";
import jwt from "jsonwebtoken";

export const getUsers = async (_req, res) => {
  return res.status(200).json(await User.find());
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Fetch existing user with email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  const salt = generateSalt();
  const hashedPassword = generateHashedValue(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    salt,
  });

  return res
    .status(201)
    .json({ message: "User created successfully", id: user._id });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });
  }

  const hashedPassword = generateHashedValue(password, user.salt);

  if (hashedPassword !== user.password) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = generateJwtToken(user);

  return res.status(200).json({ message: "Login successful", token });
};

export const updateUser = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });
  }

  const { name, password } = req.body;
  const updatedFields = { name, password };

  // Set the updated encoded password
  if (password) {
    const hashedPassword = generateHashedValue(password, user.salt);
    updatedFields.password = hashedPassword;
  }

  await User.findOneAndUpdate(
    { email },
    {
      $set: updatedFields,
    },
  );

  return res.status(200).json({ message: "User updated successfully" });
};

function generateJwtToken(user) {
  const payload = {
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}
