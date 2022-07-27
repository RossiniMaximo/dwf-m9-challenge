import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllProductsIds } from "controllers/products";

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const products = await getAllProductsIds();
  res.send({ products });
}

export default methods({
  get: handleGet,
});
