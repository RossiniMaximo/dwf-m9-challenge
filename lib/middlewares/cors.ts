import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

function initMiddleware(middleware) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    origin: ["http://localhost:3000"],
  })
);

export function corsMiddleware(callback) {
  return async function (req, res) {
    await cors(req, res);
    callback();
  };
}
