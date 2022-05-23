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
  static async createAuth(data) {
    const authSnap = await collection.add(data);
    const auth = new Auth(authSnap.id);
    auth.data = data;
    if (authSnap && auth) {
      return auth;
    }
  }
  static async findbyEmailAndCode(email: string, code: number) {
    const beautify = email.trim().toLowerCase();
    const res = await collection
      .where("email", "==", beautify)
      .where("code", "==", code)
      .get();
    if (res.docs.length) {
      const id = res.docs[0].id;
      const auth = new Auth(id);
      auth.data = res.docs[0].data();
      return auth;
    }
  }
}
