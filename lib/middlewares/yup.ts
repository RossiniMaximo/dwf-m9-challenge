import type { NextApiRequest, NextApiResponse } from "next";
import { cors } from "./cors";

export function schemasMiddleware(callback, bodySchema?, querySchema?) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    try {
      const corsCheck = await cors(req, res);
      console.log("corsCheck in yup middleware :", corsCheck);
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
