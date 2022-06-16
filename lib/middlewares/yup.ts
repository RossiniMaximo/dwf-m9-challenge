import type { NextApiRequest, NextApiResponse } from "next";
/* import NextCors from "nextjs-cors"; */
/* import { cors } from "./cors"; */

export function schemasMiddleware(callback, bodySchema?, querySchema?) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void> {
    //  await cors(req, res);
    // neither do work
    // await NextCors(req, res, {
    //   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    //   origin: "*",
    //   optionsSuccessStatus: 200,
    // });
    if (req.body) {
      await bodySchema.validate(req.body);
      callback(req, res);
    }
    if (Object.keys(req.query).length != 0) {
      await querySchema.validate(req.query);
    }
  };
}
