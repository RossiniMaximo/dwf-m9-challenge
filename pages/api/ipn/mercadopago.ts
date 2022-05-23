import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { Order } from "models/order";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;
  if (topic === "merchant_order") {
    const merchantOrder = await getMerchantOrder(id);
    if (merchantOrder.order_status == "paid") {
      const orderId = merchantOrder.external_reference;
      const order = new Order(orderId);
      await order.pull();
      order.data.status == "closed";
      await order.push();
      res.send(order);
    }
  }
}

const handler = methods({
  post: handlePost,
});

export default authMiddleware(handler);
