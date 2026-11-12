import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: Number(process.env.SCHEME_CACHE_TTL || 21600),
  checkperiod: 600,
  useClones: false
});

export function cachedResponse(keyBuilder, ttl) {
  return (req, res, next) => {
    const key = keyBuilder(req);
    const cached = cache.get(key);
    if (cached !== undefined) {
      res.set("X-Cache", "HIT");
      return res.json(cached);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode < 400) {
        cache.set(key, body, ttl);
      }
      res.set("X-Cache", "MISS");
      return originalJson(body);
    };
    next();
  };
}

export function clearSchemeCache() {
  cache.flushAll();
}
