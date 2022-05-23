import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_KEY,
});

export async function getMerchantOrder(id) {
  const merchantOrder = await mercadopago.merchant_orders.get(id);
  return merchantOrder.body;
}
export async function createPreference(data) {
  const preference = await mercadopago.preferences.create(data);
  return preference.body;
}
