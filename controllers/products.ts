import { productsIndex } from "lib/connections/algolia";
import { getHitsOfProducts } from "lib";

export async function getProducts(query, limit, offset) {
  const result = await productsIndex.search(query, {
    offset: Number(offset),
    length: Number(limit),
  });
  const body = getHitsOfProducts(result);
  return {
    wholeData: result,
    body,
  };
}
export async function getAllProductsIds() {
  const products = await productsIndex.search("");
  const productsData = getHitsOfProducts(products);
  const ids = productsData.map((p) => p.objectID);
  return ids;
}

export async function getProduct(id: string) {
  const result = await productsIndex.getObject(id);

  if (result) {
    return result;
  } else {
    throw "Product ID not found";
  }
}
