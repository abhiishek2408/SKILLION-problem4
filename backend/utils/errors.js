export function ApiError(code, message, field = null, status = 400) {
  const err = new Error(message);
  err.status = status;
  err.body = { error: { code, field, message } };
  return err;
}
