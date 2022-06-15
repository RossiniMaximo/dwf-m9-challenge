import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { queryMiddleware } from "lib/middlewares/request";
import { getProducts } from "controllers/products";
import { corsMiddleware } from "lib/middlewares/cors";

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.q as string;
  const { limit, offset } = queryMiddleware(req);
  const { wholeData, body } = await getProducts(query, limit, offset);
  res.send({
    results: body,
    pagination: {
      limit,
      offset,
      totalResults: wholeData.nbHits,
    },
  });
}

const handleGetCors = corsMiddleware(handleGet);

const handler = methods({
  get: handleGetCors,
});

export default handler;
