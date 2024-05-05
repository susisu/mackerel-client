import type { ApiClient, ApiOptions } from "./api.ts";

export type CreateHostGraphDefsInputGraphDef = Readonly<{
  name: string;
  displayName?: string | undefined;
  unit: GraphDefUnit;
  metrics: readonly CreateHostGraphDefsInputGraphDefMetric[];
}>;

export type CreateHostGraphDefsInputGraphDefMetric = Readonly<{
  name: string;
  displayName?: string | undefined;
  isStacked: boolean;
}>;

export type GraphDefUnit =
  | "float"
  | "integer"
  | "percentage"
  | "seconds"
  | "milliseconds"
  | "bytes"
  | "bytes/sec"
  | "bits/sec"
  | "iops";

export class GraphDefsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async createHostGraphDefs(
    graphDefs: readonly CreateHostGraphDefsInputGraphDef[],
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<unknown, readonly CreateHostGraphDefsInputGraphDef[]>(
      "POST",
      "/api/v0/graph-defs/create",
      {
        body: graphDefs,
        signal: options?.signal,
      },
    );
  }
}
