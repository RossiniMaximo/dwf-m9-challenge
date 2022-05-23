import jwt from "jsonwebtoken";

export function createToken(data) {
  return jwt.sign(data, process.env.JWT_KEY);
}

export function decode(token) {
  try {
    const validation = jwt.verify(token, process.env.JWT_KEY);
    return validation;
  } catch (error) {
    throw error;
  }
}
