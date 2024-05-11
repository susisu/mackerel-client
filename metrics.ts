import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<Extends<DataPoint, PostMetricsInputDataPoint>>(true);

export type TimeRange = {
  from: Date;
  to: Date;
};

export type DataPoint = {
  time: Date;
  value: number;
};

export type PostMetricsInputMetrics = {
  readonly [metricName: string]: readonly PostMetricsInputDataPoint[];
};

export type PostMetricsInputDataPoint = Readonly<{
  time: Date;
  value: number;
}>;

export type BulkPostHostMetricsInputDataPoint = Readonly<{
  hostId: string;
  metricName: string;
  time: Date;
  value: number;
}>;

export class MetricsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getHostMetricDataPoints(
    hostId: string,
    metricName: string,
    range: TimeRange,
    options?: ApiOptions,
  ): Promise<DataPoint[]> {
    const params = new URLSearchParams({
      name: metricName,
      from: Math.floor(range.from.getTime() / 1000).toString(),
      to: Math.floor(range.to.getTime() / 1000).toString(),
    });
    const res = await this.fetcher.fetch<{ metrics: RawDataPoint[] }>(
      "GET",
      `/api/v0/hosts/${hostId}/metrics`,
      {
        params,
        signal: options?.signal,
      },
    );
    return res.metrics.map((dataPoint) => fromRawDataPoint(dataPoint));
  }

  async getServiceMetricDataPoints(
    serviceName: string,
    metricName: string,
    range: TimeRange,
    options?: ApiOptions,
  ): Promise<DataPoint[]> {
    const params = new URLSearchParams({
      name: metricName,
      from: Math.floor(range.from.getTime() / 1000).toString(),
      to: Math.floor(range.to.getTime() / 1000).toString(),
    });
    const res = await this.fetcher.fetch<{ metrics: RawDataPoint[] }>(
      "GET",
      `/api/v0/services/${serviceName}/metrics`,
      {
        params,
        signal: options?.signal,
      },
    );
    return res.metrics.map((dataPoint) => fromRawDataPoint(dataPoint));
  }

  /**
   * @returns `Map<hostId, Map<metricName, DataPoint>>`
   */
  async getLatestHostMetricDataPoints(
    hostIds: readonly string[],
    metricNames: readonly string[],
    options?: ApiOptions,
  ): Promise<Map<string, Map<string, DataPoint>>> {
    const params = new URLSearchParams();
    for (const hostId of hostIds) {
      params.append("hostId", hostId);
    }
    for (const metricName of metricNames) {
      params.append("name", metricName);
    }
    type RawOutput = {
      tsdbLatest: {
        [hostId: string]: {
          [metricName: string]: RawDataPoint;
        };
      };
    };
    const res = await this.fetcher.fetch<RawOutput>(
      "GET",
      "/api/v0/tsdb/latest",
      {
        params,
        signal: options?.signal,
      },
    );
    return new Map(
      Object.entries(res.tsdbLatest).map(([hostId, metrics]) => [
        hostId,
        new Map(
          Object.entries(metrics).map(([metricName, dataPoint]) => [
            metricName,
            fromRawDataPoint(dataPoint),
          ]),
        ),
      ]),
    );
  }

  async postHostMetrics(
    hostId: string,
    metrics: PostMetricsInputMetrics,
    options?: ApiOptions,
  ): Promise<void> {
    type RawInput = ReadonlyArray<
      Readonly<{
        hostId: string;
        name: string;
        time: number;
        value: number;
      }>
    >;
    await this.fetcher.fetch<unknown, RawInput>(
      "POST",
      "/api/v0/tsdb",
      {
        body: Object.entries(metrics).flatMap(([metricName, dataPoints]) =>
          dataPoints.map((dataPoint) => ({
            hostId,
            name: metricName,
            time: Math.floor(dataPoint.time.getTime() / 1000),
            value: dataPoint.value,
          }))
        ),
        signal: options?.signal,
      },
    );
  }

  async bulkPostHostMetrics(
    dataPoints: readonly BulkPostHostMetricsInputDataPoint[],
    options?: ApiOptions,
  ): Promise<void> {
    type RawInput = ReadonlyArray<
      Readonly<{
        hostId: string;
        name: string;
        time: number;
        value: number;
      }>
    >;
    await this.fetcher.fetch<unknown, RawInput>(
      "POST",
      "/api/v0/tsdb",
      {
        body: dataPoints.map((dataPoint) => ({
          hostId: dataPoint.hostId,
          name: dataPoint.metricName,
          time: Math.floor(dataPoint.time.getTime() / 1000),
          value: dataPoint.value,
        })),
        signal: options?.signal,
      },
    );
  }

  async postServiceMetrics(
    serviceName: string,
    metrics: PostMetricsInputMetrics,
    options?: ApiOptions,
  ): Promise<void> {
    type RawInput = ReadonlyArray<
      Readonly<{
        name: string;
        time: number;
        value: number;
      }>
    >;
    await this.fetcher.fetch<unknown, RawInput>(
      "POST",
      `/api/v0/services/${serviceName}/tsdb`,
      {
        body: Object.entries(metrics).flatMap(([metricName, dataPoints]) =>
          dataPoints.map((dataPoint) => ({
            name: metricName,
            time: Math.floor(dataPoint.time.getTime() / 1000),
            value: dataPoint.value,
          }))
        ),
        signal: options?.signal,
      },
    );
  }
}

type RawDataPoint = {
  time: number;
  value: number;
};

function fromRawDataPoint(raw: RawDataPoint): DataPoint {
  return {
    time: new Date(raw.time * 1000),
    value: raw.value,
  };
}
