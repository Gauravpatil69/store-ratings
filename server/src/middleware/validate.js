import { httpError } from './error.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      throw httpError(400, message);
    }
    req.body = result.data;
    next();
  };
}
