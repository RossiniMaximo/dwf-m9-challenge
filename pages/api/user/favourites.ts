import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/auth";
import { getMe } from "controllers/user";

async function getFavourites(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getMe(token.userId);
  res.send({ result: user.data.favourites });
}
async function setFavourites(req: NextApiRequest, res: NextApiResponse, token) {
  const productId = req.body.productId;
  const user = (await getMe(token.userId)) as any;
  let favourites = user.data.favourites;
  favourites.push(productId);
  await user.push();
  if (favourites.length > 3) {
    favourites.shift();
    await user.push();
    res.send({ status: true, msg: "Added to favourites" });
  } else {
    res.send({ status: false });
  }
}

export default methods({
  get: authMiddleware(getFavourites),
  post: authMiddleware(setFavourites),
});
