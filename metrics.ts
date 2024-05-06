import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiClient, ApiOptions } from "./api.ts";

assertType<Extends<DataPoint, PostMetricsInputDataPoint>>(true);

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
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async getHostMetrics(
    hostId: string,
    metricName: string,
    from: Date,
    to: Date,
    options?: ApiOptions,
  ): Promise<DataPoint[]> {
    const params = new URLSearchParams({
      name: metricName,
      from: Math.floor(from.getTime() / 1000).toString(),
      to: Math.floor(to.getTime() / 1000).toString(),
    });
    const res = await this.api.fetch<{ metrics: RawDataPoint[] }>(
      "GET",
      `/api/v0/hosts/${hostId}/metrics`,
      {
        params,
        signal: options?.signal,
      },
    );
    return res.metrics.map((dataPoint) => fromRawDataPoint(dataPoint));
  }

  async getServiceMetrics(
    serviceName: string,
    metricName: string,
    from: Date,
    to: Date,
    options?: ApiOptions,
  ): Promise<DataPoint[]> {
    const params = new URLSearchParams({
      name: metricName,
      from: Math.floor(from.getTime() / 1000).toString(),
      to: Math.floor(to.getTime() / 1000).toString(),
    });
    const res = await this.api.fetch<{ metrics: RawDataPoint[] }>(
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
   * @returns `{ hostId: { metricName: dataPoint } }`
   */
  async getLatestHostMetricValues(
    hostIds: readonly string[],
    metricNames: readonly string[],
    options?: ApiOptions,
  ): Promise<{
    [hostId: string]: {
      [metricName: string]: DataPoint;
    };
  }> {
    const params = new URLSearchParams();
    for (const hostId of hostIds) {
      params.append("hostId", hostId);
    }
    for (const metricName of metricNames) {
      params.append("name", metricName);
    }
    const res = await this.api.fetch<{
      tsdbLatest: {
        [hostId: string]: {
          [metricName: string]: RawDataPoint;
        };
      };
    }>(
      "GET",
      "/api/v0/tsdb/latest",
      {
        params,
        signal: options?.signal,
      },
    );
    return Object.fromEntries(
      Object.entries(res.tsdbLatest).map((
        [hostId, metrics],
      ) => [
        hostId,
        Object.fromEntries(
          Object.entries(metrics).map((
            [metricName, dataPoint],
          ) => [metricName, fromRawDataPoint(dataPoint)]),
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
    await this.api.fetch<unknown, RawInput>(
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
    await this.api.fetch<unknown, RawInput>(
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
    await this.api.fetch<unknown, RawInput>(
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
