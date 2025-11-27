import { createHmac, randomBytes } from "node:crypto";

export const generateSalt = () => {
  return randomBytes(255).toString("hex");
};

export const generateHashedValue = (value, salt) => {
  if (!value || !salt) {
    return null;
  }

  return createHmac("sha256", salt).update(value).digest("hex");
};
