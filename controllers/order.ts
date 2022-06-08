import { productsIndex } from "lib/connections/algolia";
import { Order } from "models/order";
import { getMe } from "./user";
import {
  createPreference,
  getMerchantOrder,
} from "lib/connections/mercadopago";
import { User } from "models/user";
import { purchaseAlertMail } from "lib/connections/sendgrid";

export async function createOrder(productId, token, puchaseData) {
  const product = (await productsIndex.getObject(productId)) as any;
  debugger;
  if (!product) {
    throw "Product not found";
  }
  const user = await getMe(token);
  const order = await Order.createOrder({
    purchase_data: puchaseData,
    productId,
    user_id: user.id,
    status: "pending",
  });
  if (order) {
    await user.pull();
    user.data.orders.push({
      orderId: order.id,
      orderStatus: order.data.status,
    });
    await user.push();
    const preference = await createPreference({
      items: [
        {
          title: product.fields.Name,
          description: "Description ",
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: "car_electronics",
          quantity: 1,
          currency_id: "ARS",
          unit_price: product.fields["Unit cost"],
        },
      ],
      external_reference: order.id,
      notification_url:
        "https://dwf-m9-challenge.vercel.app/api/ipn/mercadopago",
    });

    return { preference, orderId: order.id };
  }
}

export async function getUserOrder(token, orderId) {
  const authId = token.userId;
  const user: any = await getMe(authId);
  const getOrder = user.data.orders.find((order) => {
    if (order.orderId == orderId) {
      return order;
    }
  });
  if (getOrder == undefined) {
    return { userOrder: undefined };
  }
  if (getOrder) {
    return { userOrder: getOrder, user };
  }
}

export async function paidMercadopagoIPNController(id, topic) {
  if (topic == "merchant_order") {
    const merchantOrder = await getMerchantOrder(id);
    if (merchantOrder.order_status == "paid") {
      console.log({ merchantOrder });

      const orderId = merchantOrder.external_reference;
      const newOrder = new Order(orderId);
      await newOrder.pull();
      newOrder.data.status = "closed";
      await newOrder.push();
      console.log({ newOrder });
      const userId = newOrder.data.user_id;
      const user = new User(userId);
      console.log({ user });
      await user.pull();
      const userOrder: any = user.data.orders.find((order: any) => {
        const result = order.orderId == orderId;
        return result;
      });
      userOrder.orderStatus = "closed";
      await user.push();
      console.log("email de usuario antes de mandar mail : ", user.data.email);
      const purchaseEmail = await purchaseAlertMail(user.data.email);
      console.log({ purchaseEmail });
      if (purchaseEmail) {
        return true;
      }
    }
  }
}
