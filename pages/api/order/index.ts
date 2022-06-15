import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { corsMiddleware } from "lib/middlewares/cors";
import { schemasMiddleware } from "lib/middlewares/yup";
import { createOrder, getUserOrder } from "controllers/order";
import * as yup from "yup";

const orderBodySchema = yup
  .object()
  .shape({
    colour: yup.string().required(),
    shippment_address: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

const orderQuerySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query;
  if (!productId) {
    res.status(404).send({ error: "Product ID has not matches" });
  }
  console.log({ token });
  const userId = token.userId;

  const result = await createOrder(productId, userId, req.body);
  const { preference, orderId } = result;

  res.send({ URL: preference.init_point, orderId });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, token) {
  const orderId = req.query.orderId;
  if (!orderId) {
    res.status(404).send({ error: "Order not found" });
  }
  console.log({ token });

  const { userOrder } = await getUserOrder(token, orderId);
  if (!userOrder) {
    res.send({ error: "Order does not exist" });
  }
  res.send({ userOrder });
}
const handleGetAuthorizated = authMiddleware(handleGet);

const handler = methods({
  post: schemasMiddleware(
    authMiddleware(handlePost),
    orderBodySchema,
    orderQuerySchema
  ),
  get: authMiddleware(handleGetAuthorizated),
});

export default corsMiddleware(handler);
