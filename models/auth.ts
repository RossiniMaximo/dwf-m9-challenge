import { isAfter } from "date-fns";
import { firestore } from "../lib/connections/firestore";

const collection = firestore.collection("auths");

export class Auth {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snapData = await this.ref.get();
    this.data = snapData.data();
  }
  async push() {
    await this.ref.update(this.data);
  }
  static async findByEmail(email: string) {
    const beautify = email.trim().toLowerCase();
    const res = await collection.where("email", "==", beautify).get();
    if (res.docs.length) {
      const id = res.docs[0].id;
      const auth = new Auth(id);
      auth.data = res.docs[0].data();
      return auth;
    }
  }
  checkExpiration() {
    const now = new Date();
    const check = isAfter(now, this.data.expiration.toDate());
    return check;
  }
  static async createAuth(data) {
    data.email.trim().toLowerCase();
    const authSnap = await collection.add(data);
    const auth = new Auth(authSnap.id);
    auth.data = data;
    if (authSnap && auth) {
      return auth;
    }
  }
  static async findbyEmailAndCode(email: string, code: number) {
    console.log("email and code in findbyEmailAndCode :", email, code);
    const beautify = email.trim().toLowerCase();
    const res = await collection
      .where("email", "==", beautify)
      .where("code", "==", code)
      .get();
    console.log("res length:", res.docs.length);
    if (res.docs.length) {
      console.log("Res.docs", res.docs);
      const id = res.docs[0].id;
      const auth = new Auth(id);
      auth.data = res.docs[0].data();
      return auth;
    }
  }
}
