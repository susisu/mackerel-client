import type { ApiOptions, Fetcher } from "./fetcher.ts";

export type Alert =
  | ConnectivityAlert
  | HostAlert
  | ServiceAlert
  | ExternalAlert
  | ExpressionAlert
  | AnomalyDetectionAlert
  | QueryAlert
  | CheckAlert;

export type BaseAlert = {
  id: string;
  status: AlertStatus;
  openedAt: Date;
  isClosed: boolean;
  closedAt: Date | undefined;
  closeReason: string | undefined;
  memo: string;
  monitorId: string;
};

export type ConnectivityAlert = BaseAlert & {
  type: "connectivity";
  hostId: string;
};

export type HostAlert = BaseAlert & {
  type: "host";
  hostId: string;
  value: number;
};

export type ServiceAlert = BaseAlert & {
  type: "service";
  value: number;
};

export type ExternalAlert = BaseAlert & {
  type: "external";
  value: number | undefined;
  message: string;
};

export type ExpressionAlert = BaseAlert & {
  type: "expression";
  value: number | undefined;
};

export type AnomalyDetectionAlert = BaseAlert & {
  type: "anomalyDetection";
  hostId: string;
};

export type QueryAlert = BaseAlert & {
  type: "query";
  value: number;
  series: QueryAlertSeries;
};

export type CheckAlert = BaseAlert & {
  type: "check";
  hostId: string;
  message: string;
};

export type AlertType = Alert["type"];

export type AlertStatus = "OK" | "CRITICAL" | "WARNING" | "UNKNOWN";

export type QueryAlertSeries = {
  name: string;
  /** `Map<key, value>` */
  labels: Map<string, string>;
};

export type UpdateAlertInput = Readonly<{
  memo: string;
}>;

export class AlertsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(
    options?: ApiOptions<{
      includeClosed: boolean;
      limit: number;
      cursor: string;
    }>,
  ): Promise<{
    alerts: Alert[];
    cursor: string | undefined;
  }> {
    const params = new URLSearchParams();
    if (options?.includeClosed) {
      params.set("withClosed", "true");
    }
    if (options?.limit !== undefined) {
      params.set("limit", options.limit.toString());
    }
    if (options?.cursor !== undefined) {
      params.set("nextId", options.cursor);
    }
    const res = await this.fetcher.fetch<{
      alerts: RawAlert[];
      nextId?: string | null | undefined;
    }>(
      "GET",
      "/api/v0/alerts",
      {
        params,
        signal: options?.signal,
      },
    );
    return {
      alerts: res.alerts.map((host) => fromRawAlert(host)),
      cursor: res.nextId ?? undefined,
    };
  }

  async get(alertId: string, options?: ApiOptions): Promise<Alert> {
    const res = await this.fetcher.fetch<RawAlert>(
      "GET",
      `/api/v0/alerts/${alertId}`,
      { signal: options?.signal },
    );
    return fromRawAlert(res);
  }

  async update(
    alertId: string,
    input: UpdateAlertInput,
    options?: ApiOptions,
  ): Promise<void> {
    await this.fetcher.fetch<unknown, UpdateAlertInput>(
      "PUT",
      `/api/v0/alerts/${alertId}`,
      {
        body: { memo: input.memo },
        signal: options?.signal,
      },
    );
  }

  async close(
    alertId: string,
    reason: string,
    options?: ApiOptions,
  ): Promise<Alert> {
    const res = await this.fetcher.fetch<RawAlert, Readonly<{ reason: string }>>(
      "POST",
      `/api/v0/alerts/${alertId}/close`,
      {
        body: { reason },
        signal: options?.signal,
      },
    );
    return fromRawAlert(res);
  }
}

type RawAlert =
  | RawConnectivityAlert
  | RawHostAlert
  | RawServiceAlert
  | RawExternalAlert
  | RawExpressionAlert
  | RawAnomalyDetectionAlert
  | RawQueryAlert
  | RawCheckAlert;

type RawBaseAlert = {
  id: string;
  status: AlertStatus;
  openedAt: number;
  closedAt?: number | null | undefined;
  reason?: string | null | undefined;
  memo: string;
  monitorId: string;
};

type RawConnectivityAlert = RawBaseAlert & {
  type: "connectivity";
  hostId: string;
};

type RawHostAlert = RawBaseAlert & {
  type: "host";
  hostId: string;
  value: number;
};

type RawServiceAlert = RawBaseAlert & {
  type: "service";
  value: number;
};

type RawExternalAlert = RawBaseAlert & {
  type: "external";
  value?: number | null | undefined;
  message: string;
};

type RawExpressionAlert = RawBaseAlert & {
  type: "expression";
  value?: number | null | undefined;
};

type RawAnomalyDetectionAlert = RawBaseAlert & {
  type: "anomalyDetection";
  hostId: string;
};

type RawQueryAlert = RawBaseAlert & {
  type: "query";
  value: number;
  series: RawQueryAlertSeries;
};

type RawCheckAlert = RawBaseAlert & {
  type: "check";
  hostId: string;
  message: string;
};

type RawQueryAlertSeries = {
  name: string;
  labels: { [key: string]: string };
};

function fromRawBaseAlert(raw: RawBaseAlert): BaseAlert {
  return {
    id: raw.id,
    status: raw.status,
    openedAt: new Date(raw.openedAt * 1000),
    isClosed: typeof raw.closedAt === "number",
    closedAt: typeof raw.closedAt === "number" ? new Date(raw.closedAt * 1000) : undefined,
    closeReason: raw.reason ?? undefined,
    memo: raw.memo,
    monitorId: raw.monitorId,
  };
}

function fromRawAlert(raw: RawAlert): Alert {
  const base: BaseAlert = fromRawBaseAlert(raw);
  switch (raw.type) {
    case "connectivity":
      return {
        ...base,
        type: "connectivity",
        hostId: raw.hostId,
      };
    case "host":
      return {
        ...base,
        type: "host",
        hostId: raw.hostId,
        value: raw.value,
      };
    case "service":
      return {
        ...base,
        type: "service",
        value: raw.value,
      };
    case "external":
      return {
        ...base,
        type: "external",
        value: raw.value ?? undefined,
        message: raw.message,
      };
    case "expression":
      return {
        ...base,
        type: "expression",
        value: raw.value ?? undefined,
      };
    case "anomalyDetection":
      return {
        ...base,
        type: "anomalyDetection",
        hostId: raw.hostId,
      };
    case "query":
      return {
        ...base,
        type: "query",
        value: raw.value,
        series: {
          name: raw.series.name,
          labels: new Map(Object.entries(raw.series.labels)),
        },
      };
    case "check":
      return {
        ...base,
        type: "check",
        hostId: raw.hostId,
        message: raw.message,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown alert type: ${type}`, { cause: raw });
    }
  }
}
