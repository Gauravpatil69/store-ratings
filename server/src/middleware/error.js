export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
}
