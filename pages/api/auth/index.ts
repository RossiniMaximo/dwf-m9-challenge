import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "../../../controllers/auth";
import * as yup from "yup";
import { schemasMiddleware } from "lib/middlewares/yup";

const authBodySchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    fullname: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { email, fullname } = req.body;
  const result = await sendCode(email, fullname);
  res.send(result);
}

const postHandlerValidate = schemasMiddleware(handlePost, authBodySchema);

const handler = methods({
  post: postHandlerValidate,
});

export default handler;
