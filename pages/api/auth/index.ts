import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "../../../controllers/auth";

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, fullname } = req.body;
  const result = await sendCode(email, fullname);
  res.send(result);
}

const handler = methods({
  post: handlePost,
});

export default handler;
