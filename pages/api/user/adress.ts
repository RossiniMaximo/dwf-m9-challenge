import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { updateData } from "controllers/user";

async function handlePatch(req: NextApiRequest, res: NextApiResponse, token) {
  const newData = req.body;
  const result = await updateData(newData, token);
  res.send({ result });
}

const handler = methods({
  patch: handlePatch,
});

export default authMiddleware(handler);
