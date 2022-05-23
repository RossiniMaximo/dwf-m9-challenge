import algoliasearch from "algoliasearch";

const client = algoliasearch("BO7KH091QS", process.env.ALGOLIA_KEY);
export const productsIndex = client.initIndex("products");
