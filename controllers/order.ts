import { productsIndex } from "lib/connections/algolia";
import { Order } from "models/order";
import { getMe } from "./user";
import {
  createPreference,
  getMerchantOrder,
} from "lib/connections/mercadopago";

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
  console.log("el token", token);
  const authId = token.userId;
  const user: any = await getMe(authId);
  const getOrder = user.data.orders.find((order) => {
    if (order.orderId == orderId) {
      return order;
    }
  });
  console.log({ getOrder });

  return { userOrder: getOrder, user };
}

export async function getMerchantOrderAndOrder(id) {
  const merchantOrder: any = await getMerchantOrder(id);
  if (merchantOrder.order_status == "paid") {
    const orderId = merchantOrder.external_reference;
    const newOrder = new Order(orderId);
    await newOrder.pull();
    const userId = newOrder.data.user_id;
    const { userOrder, user } = await getUserOrder(
      { token: { userId } },
      orderId
    );
    userOrder.status = "closed";
    newOrder.data.status = "closed";
    console.log({ userOrder: userOrder });
    console.log({ userOrderStatus: userOrder.status });
    await user.push();
    await newOrder.push();
    console.log({ userOrderDespuesDelPush: userOrder });
    console.log({ userOrderStatusDespuesDelPush: userOrder.status });
    return true;
  }
}
