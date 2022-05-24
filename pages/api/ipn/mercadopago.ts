import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { Order } from "models/order";
import { getUserOrder } from "controllers/order";
import { User } from "models/user";

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const merchantOrder = await getMerchantOrder(id);
    if (merchantOrder.order_status == "paid") {
      const orderId = merchantOrder.external_reference;
      const newOrder = new Order(orderId);
      await newOrder.pull();
      newOrder.data.status = "closed";
      await newOrder.push();
      console.log({ newOrder });
      const userId = newOrder.data.user_id;
      const user = new User(userId);
      await user.pull();
      const userOrder: any = user.data.orders.find((order: any) => {
        const result = order.orderId == orderId;
        return result;
      });
      userOrder.orderStatus = "closed";
      await user.push();
      console.log({ userOrder });
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
