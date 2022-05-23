import { productsIndex } from "lib/connections/algolia";
import { handleBody } from "lib/middlewares/algolia";

export async function getProducts(query, limit, offset) {
  const result = await productsIndex.search(query, {
    offset: Number(offset),
    length: Number(limit),
  });
  const body = handleBody(result);
  return {
    wholeData: result,
    body,
  };
}

export async function getProduct(id: string) {
  const result = await productsIndex.getObject(id);
  if (result) {
    return result;
  } else {
    throw "Product ID not found";
  }
}
