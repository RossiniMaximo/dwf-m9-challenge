import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "lib/connections/jwt";
import { corsMiddleware } from "./cors";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    try {
      corsMiddleware();
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(401).send({ msg: "Need to authenticate" });
      }
      const verify = decode(token);
      if (verify) {
        callback(req, res, verify);
      }
    } catch (error) {
      res.send({ error, statusCode: res.status });
    }
  };
}
