import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { queryMiddleware } from "lib/middlewares/request";
import { getProducts } from "controllers/products";
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.query;
  const { limit, offset } = queryMiddleware(req);
  if (query != undefined) {
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
}

const handler = methods({
  get: handleGet,
});

export default handler;
