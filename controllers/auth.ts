import { Auth } from "../models/auth";
import { User } from "../models/user";
import { createToken } from "lib/connections/jwt";
import addMinutes from "date-fns/addMinutes";
import gen from "random-seed";
import { sendEmail } from "controllers/email";

const seed = "My Secret String Value";

export async function findOrCreate(email: string, fullname: string) {
  const flatEmail = email.trim().toLowerCase();
  const res = await Auth.findByEmail(email);
  if (res) {
    return res;
  } else {
    const user = await User.createUser({ email: flatEmail, fullname });
    if (user) {
      const auth = await Auth.createAuth({
        email: flatEmail,
        ia: new Date(),
        code: "",
        expiration: "",
        userId: user.id,
      });
      return auth;
    }
  }
}

export async function sendCode(email: string, fullname: string) {
  const res = await findOrCreate(email, fullname);
  if (res) {
    let random = gen.create(seed);
    let rand = random.intBetween(10000, 99999);
    const auth = new Auth(res.id);
    await auth.pull();
    auth.data.code = rand;
    auth.data.expiration = addMinutes(new Date(), 15);
    await auth.push();
    const alertEmail = await sendEmail(
      email,
      "Authorization",
      "Your code :" +
        " " +
        auth.data.code +
        " " +
        "It expires at : " +
        auth.data.expiration
    );
    if (alertEmail) {
      return true;
    }
  }
}

export async function searchByCodeAndEmail(email: string, code: number) {
  const authSnap = await Auth.findbyEmailAndCode(email, code);
  if (authSnap) {
    const auth = new Auth(authSnap.id);
    await auth.pull();
    const expirated = auth.checkExpiration();
    if (!expirated) {
      auth.data.code = "invalidated";
      auth.data.expiration = "invalidated";
      await auth.push();
      const token = createToken({ userId: authSnap.id });
      return token;
    }
  }
}
