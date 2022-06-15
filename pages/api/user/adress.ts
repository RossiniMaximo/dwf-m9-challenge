import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { updateData } from "controllers/user";
import { corsMiddleware } from "lib/middlewares/cors";

async function handlePatch(req: NextApiRequest, res: NextApiResponse, token) {
  const newData = req.body;
  const result = await updateData(newData, token);
  res.send({ result });
}

const patchAuthValidation = authMiddleware(handlePatch);

const handler = methods({
  patch: patchAuthValidation,
});

export default handler;
