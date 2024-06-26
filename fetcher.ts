import type { Options } from "./types.ts";

export type FetcherOptions = Options<{
  base: string | URL;
}>;

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";

export type FetchOptions<Input = unknown> = Options<{
  params: URLSearchParams;
  body: Input;
  signal: AbortSignal;
}>;

export interface Fetcher {
  fetch<Output = unknown, Input = unknown>(
    method: FetchMethod,
    path: string,
    options?: FetchOptions<Input>,
  ): Promise<Output>;
}

export class DefaultFetcher implements Fetcher {
  private key: string;
  private base: URL;

  constructor(key: string, options?: FetcherOptions) {
    this.key = key;
    this.base = new URL(options?.base ?? "https://api.mackerelio.com/");
  }

  async fetch<Output = unknown, Input = unknown>(
    method: FetchMethod,
    path: string,
    options?: FetchOptions<Input>,
  ): Promise<Output> {
    const params = options?.params;
    const body = options?.body !== undefined ? JSON.stringify(options.body) : undefined;
    const signal = options?.signal;

    const url = new URL(path, this.base);
    if (params !== undefined) {
      url.search = "?" + params.toString();
    }

    const headers = new Headers({
      "X-Api-Key": this.key,
    });
    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const req = new Request(url, { method, headers, body, signal });

    const res = await fetch(req);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Failed to fetch ${method} ${path}: ${res.status} ${text}`,
        {
          cause: {
            request: req,
            response: res,
          },
        },
      );
    }

    const json = await res.json();
    return json as Output;
  }
}

// deno-lint-ignore no-explicit-any
export type MockFetcherHandler<Output = any, Input = any> = (
  options?: FetchOptions<Input>,
) => Output | Promise<Output>;

export class MockFetcher implements Fetcher {
  private handlers: Map<string, MockFetcherHandler>;

  constructor() {
    this.handlers = new Map();
  }

  mock(method: FetchMethod, path: string, handler: MockFetcherHandler): this {
    this.handlers.set(`${method} ${path}`, handler);
    return this;
  }

  async fetch<Output = unknown, Input = unknown>(
    method: FetchMethod,
    path: string,
    options?: FetchOptions<Input>,
  ): Promise<Output> {
    const handler = this.handlers.get(`${method} ${path}`);
    if (!handler) {
      throw new Error(`${method} ${path} is not mocked`);
    }
    return await handler(options);
  }
}

// deno-lint-ignore ban-types
export type ApiOptions<T = {}> = Options<{ [K in keyof T]: T[K] } & { signal: AbortSignal }>;
