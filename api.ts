export type ApiClientOptions = {
  base?: string | URL | undefined;
};

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";

export type FetchOptions = {
  params?: URLSearchParams;
  body?: string;
  signal?: AbortSignal;
};

export class ApiClient {
  private apiKey: string;
  private base: URL;

  constructor(apiKey: string, options?: ApiClientOptions) {
    this.apiKey = apiKey;
    this.base = new URL(options?.base ?? "https://api.mackerelio.com/");
  }

  async fetch<T = unknown>(
    method: FetchMethod,
    path: string,
    options?: FetchOptions,
  ): Promise<T> {
    const params = options?.params;
    const body = options?.body;
    const signal = options?.signal;

    const url = new URL(path, this.base);
    if (params !== undefined) {
      url.search = "?" + params.toString();
    }

    const headers = new Headers({
      "X-Api-Key": this.apiKey,
    });
    if (body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const req = new Request(url, { method, headers, body, signal });

    const res = await fetch(req);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${method} ${path}: ${res.status}`,
        {
          cause: {
            request: req,
            response: res,
          },
        },
      );
    }

    const json = await res.json();
    return json as T;
  }
}
