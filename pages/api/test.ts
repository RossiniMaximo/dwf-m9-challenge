import methods from "micro-method-router";
import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const user = new User("GSoNHksqAano8TC6I8Zc");
    await user.pull();
    const userOrder: any = user.data.orders.find((order: any) => {
      const result = order.orderId == "zz811ZzxWqzp40N5glYB";
      return result;
    });
    console.log({ userOrder });
    userOrder.orderStatus = "closed";
    await user.push();
    res.send(userOrder);
  },
});
