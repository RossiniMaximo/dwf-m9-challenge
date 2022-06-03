import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { createOrder, getUserOrder } from "controllers/order";
import * as yup from "yup";

let orderBodySchema = yup
  .object()
  .shape({
    colour: yup.string(),
    shippment_address: yup.string(),
  })
  .noUnknown(true)
  .strict();

let orderQuerySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown(true)
  .strict();

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const validateBody = await orderBodySchema.validate(req.body);
    const valiteQuery = await orderQuerySchema.validate(req.query);
  } catch (error) {
    res.status(400).send({ error: error });
  }
  const { productId } = req.query;
  if (!productId) {
    res.status(404).send({ error: "Product ID has not matches" });
  }
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
  const { userOrder } = await getUserOrder(token, orderId);
  if (!userOrder) {
    res.send({ error: "Order does not exist" });
  } else {
    res.send({ userOrder });
  }
}

const handler = methods({
  post: handlePost,
  get: handleGet,
});

export default authMiddleware(handler);
