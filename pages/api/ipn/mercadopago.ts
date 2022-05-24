import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrder } from "lib/connections/mercadopago";
import { Order } from "models/order";
import { loadDefaultErrorComponents } from "next/dist/server/load-components";
import { User } from "models/user";
import { isRegularExpressionLiteral } from "typescript";
import { getMerchantOrderAndOrder } from "controllers/order";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const result = await getMerchantOrderAndOrder(id, token);
    res.send(result);
  }
}

const handler = methods({
  post: handlePost,
});

export default handler;

// tengo que buscar la orden en su collection , sacarle el user id , buscar el user y modificarle
// la orden a closed
// tengo que pasar la logica a un controller.
