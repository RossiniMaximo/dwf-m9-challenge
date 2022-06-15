import type { NextApiRequest, NextApiResponse } from "next";
import { corsMiddleware } from "./cors";

export function schemasMiddleware(callback, bodySchema?, querySchema?) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      corsMiddleware();
      if (req.body) {
        await bodySchema.validate(req.body);
        callback(req, res);
      }
      if (Object.keys(req.query).length != 0) {
        await querySchema.validate(req.query);
      }
    } catch (error) {
      res.send({ error: error });
    }
  };
}
