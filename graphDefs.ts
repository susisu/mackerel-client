import type { ApiOptions, Fetcher } from "./fetcher.ts";

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
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async createHostGraphDefs(
    graphDefs: readonly CreateHostGraphDefsInputGraphDef[],
    options?: ApiOptions,
  ): Promise<void> {
    await this.fetcher.fetch<unknown, readonly CreateHostGraphDefsInputGraphDef[]>(
      "POST",
      "/api/v0/graph-defs/create",
      {
        body: graphDefs,
        signal: options?.signal,
      },
    );
  }
}
