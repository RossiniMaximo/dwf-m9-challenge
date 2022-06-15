import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getProduct } from "controllers/products";
import { cors } from "lib/middlewares/cors";

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  cors(req, res);
  const productId = req.query.productId as string;
  if (!productId) {
    res.status(404).send({ error: "Product ID needed" });
  }
  try {
    const result = await getProduct(productId);
    res.send({ result });
  } catch (error) {
    res.status(404).send({ error: "Product required not found" });
  }
}

const handler = methods({
  get: handleGet,
});

export default handler;
