import Cors from "cors";
import type {NextApiRequest,NextApiResponse} from "next"

function initMiddleware(middleware) {
  return (req:NextApiRequest, res:NextApiResponse) =>
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
    origin: "*",
  })
);
