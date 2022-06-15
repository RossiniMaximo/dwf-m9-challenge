import Cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: "http//localhost:3000",
  })
);

export function corsMiddleware(callback) {
  return async function (req, res) {
    await cors(req, res);
    callback(req, res);
  };
}
