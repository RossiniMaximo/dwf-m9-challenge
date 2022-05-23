import { productsIndex } from "lib/connections/algolia";
import { Order } from "models/order";
import { getMe } from "./user";
import { createPreference } from "lib/connections/mercadopago";

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
      back_urls: {
        failure: "  ",
        pending: "",
        success: "",
      },
    });

    return preference;
  }
}
