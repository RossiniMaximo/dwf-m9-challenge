import { firestore } from "../lib/connections/firestore";
const collection = firestore.collection("users");

type userData = {
  email: string;
  fullname: string;
  user_address: any;
  phone_number: string;
  id: string;
  orders: [{}];
  favourites: [];
};

export class User {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: userData;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
    this.data = {
      email: "",
      fullname: "",
      user_address: "",
      phone_number: "",
      id: id,
      orders: [{}],
      favourites: [],
    };
  }
  async pull() {
    const snapData = await this.ref.get();
    const newData = snapData.data();
    this.data.email = newData.email;
    this.data.fullname = newData.fullname;
    this.data.user_address = newData.user_address || "";
    this.data.phone_number = newData.phone_number || "";
    this.data.orders = newData.orders || [{}];
    this.data.favourites = newData.favourites || [];
  }
  async push() {
    await this.ref.update(this.data);
  }
  static async createUser(data) {
    data.email.trim().toLowerCase();
    const userSnap = await collection.add(data);
    const user = new User(userSnap.id);
    user.data = data;
    if (userSnap && user) {
      return user;
    }
  }
}
