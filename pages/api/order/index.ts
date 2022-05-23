import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { createOrder } from "controllers/order";
import { User } from "models/user";
import { getMe } from "controllers/user";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query;
  if (!productId) {
    res.status(404).send({ error: "Product ID has not matches" });
  }
  const userId = token.userId;
  const result = await createOrder(productId, userId, req.body);
  res.send({ URL: result.init_point });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, token) {
  const orderId = req.query.orderId;
  if (!orderId) {
    res.status(404).send({ error: "Order not found" });
  }
  const authId = token.userId;
  const user: any = await getMe(authId);
  const getOrder = user.data.orders.find((order) => {
    if (order.orderId == orderId) {
      return order;
    }
  });
  res.send(getOrder);
}

const handler = methods({
  post: handlePost,
  get: handleGet,
});

export default authMiddleware(handler);
