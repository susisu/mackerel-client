export type ApiClientOptions = {
  base?: string | URL | undefined;
};

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";

export type FetchOptions<Input> = {
  params?: URLSearchParams;
  body?: Input;
  signal?: AbortSignal;
};

export class ApiClient {
  private key: string;
  private base: URL;

  constructor(key: string, options?: ApiClientOptions) {
    this.key = key;
    this.base = new URL(options?.base ?? "https://api.mackerelio.com/");
  }

  async fetch<Output = unknown, Input = unknown>(
    method: FetchMethod,
    path: string,
    options?: FetchOptions<Input>,
  ): Promise<Output> {
    const params = options?.params;
    const body = options?.body !== undefined
      ? JSON.stringify(options.body)
      : undefined;
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
    return json as Output;
  }
}
