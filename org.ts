import type { ApiClient, ApiOptions } from "./api.ts";

export type Org = {
  name: string;
  displayName: string | undefined;
};

export class OrgApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async get(options?: ApiOptions): Promise<Org> {
    type RawOrg = {
      name: string;
      displayName?: string | null | undefined;
    };
    const res = await this.api.fetch<RawOrg>(
      "GET",
      "/api/v0/org",
      { signal: options?.signal },
    );
    return {
      name: res.name,
      displayName: res.displayName ?? undefined,
    };
  }
}
