import logger from "./log.ts";

export interface RateLimitConfig {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    maxRetries?: number;
    baseDelayMs?: number;
}

export class RateLimitedFetcher {
    private requestTimestamps: number[] = [];
    private config: Required<RateLimitConfig>;

    constructor(config?: RateLimitConfig) {
        this.config = {
            requestsPerSecond: config?.requestsPerSecond ?? 5,
            requestsPerMinute: config?.requestsPerMinute ?? 60,
            maxRetries: config?.maxRetries ?? 3,
            baseDelayMs: config?.baseDelayMs ?? 1000,
        };
    }

    /**
     * Waits until the request is allowed based on rate limits.
     */
    private async waitForRateLimit(): Promise<void> {
        const now = Date.now();
        const oneSecondAgo = now - 1000;
        const oneMinuteAgo = now - 60000;

        // Clean up old timestamps
        this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);

        // Check per-second limit
        const requestsLastSecond = this.requestTimestamps.filter(ts => ts > oneSecondAgo).length;
        if (requestsLastSecond >= this.config.requestsPerSecond) {
            const oldestInWindow = this.requestTimestamps.find(ts => ts > oneSecondAgo);
            const waitTime = 1000 - (now - (oldestInWindow || now));
            await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 10)));
            return this.waitForRateLimit();
        }

        // Check per-minute limit
        if (this.requestTimestamps.length >= this.config.requestsPerMinute) {
            const oldestTimestamp = this.requestTimestamps[0];
            const waitTime = 60000 - (now - oldestTimestamp);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.waitForRateLimit();
        }
    }

    /**
     * Fetches a URL with retry logic on rate limits (429) or network errors.
     * 
     * @param url The URL to fetch
     * @param options Fetch request options (method, body, headers, etc...)
     * @param [retryCount=0] Retry count before fetch error is thrown
     * 
     * @returns {Promise<Response>} The fetch response
     */
    private async fetchWithRetry(
        url: string,
        options?: RequestInit,
        retryCount: number = 0
    ): Promise<Response> {
        try {
            await this.waitForRateLimit();
            const response = await fetch(url, options);

            // Handle rate limit response
            if (response.status === 429 && retryCount < this.config.maxRetries) {
                const retryAfter = response.headers.get('Retry-After');
                let delay: number;
                if (retryAfter) {
                    delay = parseInt(retryAfter, 10) * 1000;
                } else {
                    // Exponential backoff: baseDelayMs * 2^retryCount
                    delay = this.config.baseDelayMs * Math.pow(2, retryCount);
                }
                logger.warn(`Rate limited (429). Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithRetry(url, options, retryCount + 1);
            }

            // Record successful request timestamp
            this.requestTimestamps.push(Date.now());
            return response;
        } catch (error) {
            if (retryCount < this.config.maxRetries) {
                const delay = this.config.baseDelayMs * Math.pow(2, retryCount);
                logger.warn(`Request failed (${error}). Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Public method to fetch JSON with built-in rate limiting
     * 
     * @param url The URL to fetch
     * @param options Fetch options (method, headers, etc.)
     * @returns Parsed JSON response
     */
    async fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await this.fetchWithRetry(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
        }
        return response.json();
    }

    /**
     * Public method to fetch text with rate limiting
     */
    async fetchText(url: string, options?: RequestInit): Promise<string> {
        const response = await this.fetchWithRetry(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
        }
        return response.text();
    }

    /**
     * Public method to fetch a URL and return the raw Response object with rate limiting
     * 
     * @param url The URL to fetch
     * @param options Fetch options (method, headers, etc...)
     * @returns Raw Response object
     */
    async fetchRaw(url: string, options?: RequestInit): Promise<Response> {
        return await this.fetchWithRetry(url, options);
    }
}
