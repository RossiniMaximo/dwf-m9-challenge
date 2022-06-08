import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "lib/connections/jwt";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
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
export function authMiddlewareForSchema(
  req: NextApiRequest,
  res: NextApiResponse,
  callback
) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).send({ msg: "Need to authenticate" });
  }
  const verify = decode(token);
  if (verify) {
    callback(req, res, verify);
  }
}
