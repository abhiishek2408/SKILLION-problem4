import IdempotencyKey from "../models/IdempotencyKey.js";

export default function requireIdempotency() {
  return async (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) return next();
    const record = await IdempotencyKey.findOne({ key });
    if (record) {
      return res.status(record.statusCode || 200).json(record.responseBody);
    }
 
    const oldJson = res.json.bind(res);
    res.json = async (body) => {
      try {
        await IdempotencyKey.create({
          key,
          userId: req.user ? req.user._id : null,
          responseBody: body,
          statusCode: res.statusCode
        });
      } catch (e) {
   
      }
      return oldJson(body);
    };
    next();
  };
}
