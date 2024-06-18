import type { ApiOptions, Fetcher } from "./fetcher.ts";

export type CreateHostGraphDefsInputGraphDef = Readonly<{
  name: string;
  displayName?: string | undefined;
  unit?: GraphDefUnit | undefined;
  metrics?: readonly CreateHostGraphDefsInputGraphDefMetric[] | undefined;
}>;

export type CreateHostGraphDefsInputGraphDefMetric = Readonly<{
  name: string;
  displayName?: string | undefined;
  isStacked?: boolean | undefined;
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
    type RawInputGraphDef = Readonly<{
      name: string;
      displayName?: string | undefined;
      unit: GraphDefUnit;
      metrics: readonly RawInputGraphDefMetric[];
    }>;
    type RawInputGraphDefMetric = Readonly<{
      name: string;
      displayName?: string | undefined;
      isStacked: boolean;
    }>;
    await this.fetcher.fetch<unknown, readonly RawInputGraphDef[]>(
      "POST",
      "/api/v0/graph-defs/create",
      {
        body: graphDefs.map((graphDef) => ({
          name: graphDef.name,
          displayName: graphDef.displayName,
          unit: graphDef.unit ?? "float",
          metrics: graphDef.metrics
            ? graphDef.metrics.map((metric) => ({
              name: metric.name,
              displayName: metric.displayName,
              isStacked: metric.isStacked ?? false,
            }))
            : [],
        })),
        signal: options?.signal,
      },
    );
  }

  async deleteHostGraphDef(
    graphDefName: string,
    options?: ApiOptions,
  ): Promise<void> {
    await this.fetcher.fetch<unknown, { name: string }>(
      "DELETE",
      "/api/v0/graph-defs",
      {
        body: { name: graphDefName },
        signal: options?.signal,
      },
    );
  }
}
