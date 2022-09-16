import { productsIndex } from "lib/connections/algolia";
import { Order } from "models/order";
import { getMe } from "./user";
import {
  createPreference,
  getMerchantOrder,
} from "lib/connections/mercadopago";
import { User } from "models/user";
import { sendPurchaseEmail } from "lib/connections/sendinblue";

export async function createOrder(productId, token, purchaseData) {
  const product = (await productsIndex.getObject(productId)) as any;

  if (!product) {
    throw "Product not found";
  }
  const user = await getMe(token);
  const order = await Order.createOrder({
    purchase_data: purchaseData,
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
    // BACK URLS IS THE KEY TO HAVE THE USERS RETURNING TO OUR PAGE AFTER PAYING
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
      back_urls: {
        success: "https://dwf-m10-challenge.vercel.app/thanks",
      },
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
    console.log({ merchantOrder });

    if (merchantOrder.order_status == "paid") {
      const orderId = merchantOrder.external_reference;
      const newOrder = new Order(orderId);
      await newOrder.pull();
      newOrder.data.status = "closed";
      await newOrder.push();
      const userId = newOrder.data.user_id;
      const user = new User(userId);
      await user.pull();
      const userOrder: any = user.data.orders.find((order: any) => {
        const result = order.orderId == orderId;

        return result;
      });
      userOrder.orderStatus = "closed";
      await user.push();
      const purchaseEmail = await sendPurchaseEmail({
        email: user.data.email,
        fullname: user.data.fullname,
        name: "",
      });
      if (purchaseEmail) {
        return true;
      }
    }
  }
}
