import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { updateData } from "controllers/user";

// modify it to make it receive the phone number

async function handlePatch(req: NextApiRequest, res: NextApiResponse, token) {
  const result = await updateData(req.body, token);
  if (result) {
    res.send(true);
  } else {
    res.send(false);
  }
}

const patchAuthValidation = authMiddleware(handlePatch);

const handler = methods({
  patch: patchAuthValidation,
});

export default handler;
