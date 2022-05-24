import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { Order } from "models/order";
import { loadDefaultErrorComponents } from "next/dist/server/load-components";
import { User } from "models/user";
import { isRegularExpressionLiteral } from "typescript";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const merchantOrder = await getMerchantOrder(id);
    if (merchantOrder.order_status == "paid") {
      const orderId = merchantOrder.external_reference;
      const order = new Order(orderId);
      await order.pull();
      const userId = order.data.user_id;
      const user = new User(userId);
      console.log("user antes de ser iterado", user);
      await user.pull();
      (user as any).data.orders.find(async (orders) => {
        if (orders.id == orderId) {
          console.log("order encontrada =", orders);
          return orders.status == "closed";
        }
        await user.push();
      });
      order.data.status = "closed";
      console.log("User final =", user);

      await order.push();
      res.send(true);
    }
  }
}

const handler = methods({
  post: handlePost,
});

export default handler;

// tengo que buscar la orden en su collection , sacarle el user id , buscar el user y modificarle
// la orden a closed
// tengo que pasar la logica a un controller.
