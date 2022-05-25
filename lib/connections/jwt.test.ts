import test from "ava";
import { createToken, decode } from "./jwt";

test("createToken", (t) => {
  const data = { userId: 1234 };
  const token = createToken(data);
  const validate = decode(token);
  delete validate.iat;
  t.deepEqual(validate, data);
});
