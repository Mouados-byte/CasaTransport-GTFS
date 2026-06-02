import logger from "./log.ts"

export const Cache = <This extends object, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => {
    const instanceCache = new WeakMap<This, Map<string, Return>>();

    return function (this: This, ...args: Args): Return {
        let cacheMap = instanceCache.get(this);
        if (!cacheMap) {
            cacheMap = new Map<string, Return>();
            instanceCache.set(this, cacheMap);
        }

        const key = JSON.stringify(args);

        if (cacheMap.has(key)) {
            logger.debug(`[Cache] hit for ${String(context.name)} (${key})`);
            return cacheMap.get(key)!;
        }

        logger.debug(`[Cache] miss for ${String(context.name)} (${key})`);
        const result = target.call(this, ...args);

        // if the method returns a Promise, handle rejection cleanup
        if (result instanceof Promise) {
            const cleanResult = result.catch((err) => {
                // remove failed promise from cache so next call retries
                if (cacheMap?.get(key) === result) {
                    cacheMap.delete(key);
                }
                throw err;
            });
            cacheMap.set(key, cleanResult as Return);
            return cleanResult as Return;
        }

        cacheMap.set(key, result);
        return result;
    };
}
