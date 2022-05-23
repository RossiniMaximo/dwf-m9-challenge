import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchByCodeAndEmail } from "controllers/auth";

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;
  const result = await searchByCodeAndEmail(email, code);
  if (result) {
    res.send({ token: result });
  } else {
    res.status(404).send({ msg: "There were no matches" });
  }
}

const handler = methods({
  post: handlePost,
});

export default handler;
