import { firestore } from "lib/connections/firestore";

const collection = firestore.collection("orders");

export class Order {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const dataSnap = await this.ref.get();
    this.data = dataSnap.data();
  }
  async push() {
    await this.ref.update(this.data);
  }
  static async createOrder(data) {
    const orderSnap = await collection.add(data);
    const order = new Order(orderSnap.id);
    order.data = data;
    return order;
  }
}
