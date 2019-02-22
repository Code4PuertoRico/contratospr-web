export class ResponseError extends Error {
  constructor({ statusCode, statusText }, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }

    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}
