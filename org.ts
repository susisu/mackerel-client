import type { ApiOptions, Fetcher } from "./fetcher.ts";

export type Org = {
  name: string;
  displayName: string | undefined;
};

export class OrgApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async get(options?: ApiOptions): Promise<Org> {
    type RawOrg = {
      name: string;
      displayName?: string | null | undefined;
    };
    const res = await this.fetcher.fetch<RawOrg>(
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
