import { User } from "models/user";
import { Auth } from "models/auth";

export async function getMe(authId: string) {
  const auth = new Auth(authId);
  await auth.pull();
  const userId = auth.data.userId;
  const user = new User(userId);
  await user.pull();
  return user;
}

export async function updateData(data, token) {
  const user = await getMe(token.userId);
  user.data.user_address = data.adress;
  await user.push();
  return user.data;
}
