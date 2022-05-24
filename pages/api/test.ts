import methods from "micro-method-router";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const user = new User("dCeD2RqSA8YIKOK5SBnn");
    await user.pull();
    console.log({ user });
    const userOrder: any = user.data.orders.find((order: any) => {
      const result = order.orderId == "RPU6sHMHStTvEmlnUzJM";
      return result;
    });
    console.log({ userOrder });
    userOrder.orderStatus = "closed";
    await user.push();
    res.send(userOrder);
  },
});
