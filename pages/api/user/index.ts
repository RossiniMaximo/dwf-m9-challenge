import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { getMe } from "controllers/user";
import { corsMiddleware } from "lib/middlewares/cors";

async function handleGet(req: NextApiRequest, res: NextApiResponse, token) {
  const result = await getMe(token.userId);
  res.send(result.data);
}

const getAuthValidation = authMiddleware(authMiddleware);

const handler = methods({
  get: getAuthValidation,
});

export default handler;
