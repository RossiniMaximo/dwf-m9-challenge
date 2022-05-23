export function handleBody(body) {
  const result = body.hits.map((item) => {
    return {
      fields: item.fields,
      objectID: item.objectID,
    };
  });
  return result;
}
