import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "lib/connections/jwt";
import NextCors from "nextjs-cors";
/* import { cors } from "./cors"; */

export function authMiddleware(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    //  await cors(req, res);
    await NextCors(req, res, {
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401).send({ msg: "Need to authenticate" });
    }
    const verify = decode(token);
    if (verify) {
      callback(req, res, verify);
    }
  };
}
