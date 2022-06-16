import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchByCodeAndEmail } from "controllers/auth";
import * as yup from "yup";
import { schemasMiddleware } from "lib/middlewares/yup";

let tokenBodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.number().required(),
  })
  .noUnknown(true)
  .strict();

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    await tokenBodySchema.validate(req.body);
  } catch (error) {
    res.status(400).send({ error });
  }
  const { email, code } = req.body;
  const result = await searchByCodeAndEmail(email, code);
  if (result) {
    res.send({ token: result });
  } else {
    res.status(404).send({ msg: "There were no matches" });
  }
}

const postSchemaValidation = schemasMiddleware(handlePost, tokenBodySchema);

const handler = methods({
  post: postSchemaValidation,
});

export default handler;
