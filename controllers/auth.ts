import { Auth } from "../models/auth";
import { User } from "../models/user";
import { createToken } from "lib/connections/jwt";
import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { sendEmail } from "controllers/email";

const seed = "My Secret String Value";
var random = gen.create(seed);

async function findOrCreate(email, fullname) {
  const res = await Auth.findByEmail(email);
  if (res) {
    return res;
  } else {
    const user = await User.createUser({ email, fullname });
    if (user) {
      const auth = await Auth.createAuth({
        email,
        ia: new Date(),
        code: "",
        expiration: "",
        userId: user.id,
      });
      return auth;
    }
  }
}

export async function sendCode(email, fullname) {
  const res = await findOrCreate(email, fullname);
  if (res) {
    const rand = random.intBetween(10000, 99999);
    const auth = new Auth(res.id);
    await auth.pull();
    auth.data.code = rand;
    auth.data.expiration = addMinutes(new Date(), 15);
    await auth.push();
    const alertEmail = await sendEmail(
      email,
      "Authorization",
      "Your code :" +
        auth.data.code +
        " " +
        "It expires at : " +
        auth.data.expiration
    );
    return auth.data;
    // Send email
  }
}
// invalidate the code if res exists
export async function searchByCodeAndEmail(email: string, code: number) {
  const authSnap = await Auth.findbyEmailAndCode(email, code);
  if (authSnap) {
    const auth = new Auth(authSnap.id);
    await auth.pull();
    auth.data.code = "invalidated";
    auth.data.expiration = "invalidated";
    await auth.push();
    if (auth) {
      const token = createToken({ userId: authSnap.id });
      return token;
    }
  }
}
