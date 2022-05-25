import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { paidMercadopagoIPNController } from "controllers/order";

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  const result = await paidMercadopagoIPNController(id, topic);

  res.send(result);
}

const handler = methods({
  post: handlePost,
});

export default handler;
