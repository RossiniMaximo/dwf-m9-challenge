import { corsMiddleware } from "./cors";
export function queryMiddleware(body, maxLimit = 25, maxOffset = 24) {
  corsMiddleware();
  const queryLimit = body.query.limit;
  const queryOffset = body.query.offset;

  let limit = 10;
  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  } else if (queryLimit < 0) {
    limit = limit;
  }

  let offset = 1;
  if (queryOffset > 0 && queryOffset < maxOffset) {
    offset = queryOffset;
  } else if (queryOffset > maxOffset) {
    offset = maxOffset;
  } else if (queryOffset < 0) {
    offset = offset;
  }

  return {
    limit,
    offset,
  };
}
