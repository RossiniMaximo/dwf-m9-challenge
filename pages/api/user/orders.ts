import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { getUserOrders } from "controllers/user";

async function handleGet(req: NextApiRequest, res: NextApiResponse, token) {
  const authId = token.userId;
  const result = await getUserOrders(authId);
  res.send(result);
}

const handler = methods({
  get: handleGet,
});

export default authMiddleware(handler);
