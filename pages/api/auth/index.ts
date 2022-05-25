import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "../../../controllers/auth";
import * as yup from "yup";

let authBodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    fullname: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authBodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ error });
  }
  const { email, fullname } = req.body;
  const result = await sendCode(email, fullname);
  res.send(result);
}

const handler = methods({
  post: handlePost,
});

export default handler;
