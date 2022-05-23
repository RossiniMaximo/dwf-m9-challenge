import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { Order } from "models/order";
import { loadDefaultErrorComponents } from "next/dist/server/load-components";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const merchantOrder = await getMerchantOrder(id);
    console.log({ merchantOrder });

    if (merchantOrder.order_status == "paid") {
      const orderId = merchantOrder.external_reference;
      console.log({ orderId });
      const order = new Order(orderId);
      await order.pull();
      order.data.status == "closed";
      console.log({ order });
      await order.push();
      res.send(order);
    }
  }
}

const handler = methods({
  post: handlePost,
});

export default handler;

// tengo que sacar el user id de la order y cambiarle el estado a la orden del usuario me parece
// Este endpoint no esta andando
