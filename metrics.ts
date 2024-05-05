import type { ApiClient, ApiOptions } from "./api.ts";

export type PostMetricsInputDataPoint = Readonly<{
  name: string;
  time: Date;
  value: number;
}>;

export type BulkPostHostMetricsInputDataPoint = Readonly<{
  hostId: string;
  name: string;
  time: Date;
  value: number;
}>;

export type DataPoint = {
  time: Date;
  value: number;
};

export class MetricsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async postHostMetrics(
    hostId: string,
    dataPoints: readonly PostMetricsInputDataPoint[],
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
    await this.api.fetch<{ success: true }, RawInput>(
      "POST",
      "/api/v0/tsdb",
      {
        body: dataPoints.map((dp) => ({
          hostId,
          name: dp.name,
          time: Math.floor(dp.time.getTime() / 1000),
          value: dp.value,
        })),
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
    await this.api.fetch<{ success: true }, RawInput>(
      "POST",
      "/api/v0/tsdb",
      {
        body: dataPoints.map((dp) => ({
          hostId: dp.hostId,
          name: dp.name,
          time: Math.floor(dp.time.getTime() / 1000),
          value: dp.value,
        })),
        signal: options?.signal,
      },
    );
  }

  async postServiceMetrics(
    serviceName: string,
    dataPoints: readonly PostMetricsInputDataPoint[],
    options?: ApiOptions,
  ): Promise<void> {
    type RawInput = ReadonlyArray<
      Readonly<{
        name: string;
        time: number;
        value: number;
      }>
    >;
    await this.api.fetch<{ success: true }, RawInput>(
      "POST",
      `/api/v0/services/${serviceName}/tsdb`,
      {
        body: dataPoints.map((dp) => ({
          name: dp.name,
          time: Math.floor(dp.time.getTime() / 1000),
          value: dp.value,
        })),
        signal: options?.signal,
      },
    );
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
    return res.metrics.map((dp) => fromRawDataPoint(dp));
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
    return res.metrics.map((dp) => fromRawDataPoint(dp));
  }

  async getLatestHostMetricValues(
    hostIds: readonly string[],
    metricNames: readonly string[],
    options?: ApiOptions,
  ): Promise<Record<string, Record<string, DataPoint>>> {
    const params = new URLSearchParams();
    for (const hostId of hostIds) {
      params.append("hostId", hostId);
    }
    for (const metricName of metricNames) {
      params.append("name", metricName);
    }
    const res = await this.api.fetch<
      { tsdbLatest: Record<string, Record<string, RawDataPoint>> }
    >(
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
            [metricName, dp],
          ) => [metricName, fromRawDataPoint(dp)]),
        ),
      ]),
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
