import type { ApiClient, ApiOptions } from "./api.ts";
import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";

assertType<Extends<Monitor, CreateMonitorInput>>(true);

export type Monitor =
  | ConnectivityMonitor
  | HostMonitor
  | ServiceMonitor
  | ExternalMonitor
  | ExpressionMonitor
  | AnomalyDetectionMonitor
  | QueryMonitor;

type BaseMonitor = {
  id: string;
  name: string;
  memo: string;
  notificationIntervalMinutes: number | undefined;
  isMuted: boolean;
};

export type ConnectivityMonitor = BaseMonitor & {
  type: "connectivity";
  scopes: {
    include: string[] | undefined;
    exclude: string[] | undefined;
  };
  alertStatus: ConnectivityMonitorAlertStatus;
};

export type HostMonitor = BaseMonitor & {
  type: "host";
  metricName: string;
  scopes: {
    include: string[] | undefined;
    exclude: string[] | undefined;
  };
  conditions: {
    operator: MonitorOperator;
    warning: number | undefined;
    critical: number | undefined;
    averageOverDataPoints: number;
    numAttempts: number;
  };
};

export type ServiceMonitor = BaseMonitor & {
  type: "service";
  serviceName: string;
  metricName: string;
  conditions: {
    operator: MonitorOperator;
    warning: number | undefined;
    critical: number | undefined;
    averageOverDataPoints: number;
    numAttempts: number;
  };
  inactivityConditions: {
    warningMinutes: number | undefined;
    criticalMinutes: number | undefined;
  };
};

export type ExternalMonitor = BaseMonitor & {
  type: "external";
  serviceName: string | undefined;
  request: {
    url: URL;
    method: ExternalMonitorHttpMethod;
    headers: Headers;
    body: string;
    followRedirects: boolean;
    skipCertificateVerification: boolean;
  };
  conditions: {
    bodyMustContain: string | undefined;
    responseTimeWarningMillis: number | undefined;
    responseTimeCriticalMillis: number | undefined;
    responseTimeAverageOverDataPoints: number | undefined;
    certificateExpirationWarningDays: number | undefined;
    certificateExpirationCriticalDays: number | undefined;
    numAttempts: number;
  };
};

export type ExpressionMonitor = BaseMonitor & {
  type: "expression";
  expression: string;
  conditions: Readonly<{
    operator: MonitorOperator;
    warning: number | undefined;
    critical: number | undefined;
  }>;
};

export type AnomalyDetectionMonitor = BaseMonitor & {
  type: "anomalyDetection";
  scopes: string[];
  trainFrom: Date | undefined;
  conditions: Readonly<{
    warning: AnomalyDetectionMonitorSensitivity | undefined;
    critical: AnomalyDetectionMonitorSensitivity | undefined;
    numAttempts: number;
  }>;
};

export type QueryMonitor = BaseMonitor & {
  type: "query";
  queryName: string;
  query: string;
  conditions: Readonly<{
    operator: MonitorOperator;
    warning: number | undefined;
    critical: number | undefined;
  }>;
};

export type MonitorOperator = ">" | "<";

export type ConnectivityMonitorAlertStatus = "CRITICAL" | "WARNING";

export type ExternalMonitorHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type AnomalyDetectionMonitorSensitivity =
  | "insensitive"
  | "normal"
  | "sensitive";

export type CreateMonitorInput =
  | CreateConnectivityMonitorInput
  | CreateHostMonitorInput
  | CreateServiceMonitorInput
  | CreateExternalMonitorInput
  | CreateExpressionMonitorInput
  | CreateAnomalyDetectionMonitorInput
  | CreateQueryMonitorInput;

type BaseCreateMonitorInput = Readonly<{
  name: string;
  memo?: string | undefined;
  notificationIntervalMinutes?: number | undefined;
  isMuted?: boolean | undefined;
}>;

export type CreateConnectivityMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "connectivity";
    scopes?: Readonly<{
      include?: readonly string[] | undefined;
      exclude?: readonly string[] | undefined;
    }>;
    alertStatus?: ConnectivityMonitorAlertStatus | undefined;
  }>;

export type CreateHostMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "host";
    metricName: string;
    scopes?: Readonly<{
      include?: readonly string[] | undefined;
      exclude?: readonly string[] | undefined;
    }>;
    conditions: Readonly<{
      operator: MonitorOperator;
      warning?: number | undefined;
      critical?: number | undefined;
      averageOverDataPoints?: number | undefined;
      numAttempts?: number | undefined;
    }>;
  }>;

export type CreateServiceMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "service";
    serviceName: string;
    metricName: string;
    conditions: Readonly<{
      operator: MonitorOperator;
      warning?: number | undefined;
      critical?: number | undefined;
      averageOverDataPoints?: number | undefined;
      numAttempts?: number | undefined;
    }>;
    inactivityConditions?:
      | Readonly<{
        warningMinutes?: number | undefined;
        criticalMinutes?: number | undefined;
      }>
      | undefined;
  }>;

export type CreateExternalMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "external";
    serviceName?: string | undefined;
    request: Readonly<{
      url: string | URL;
      method?: ExternalMonitorHttpMethod | undefined;
      /** `{ name: value }` or `Headers` object */
      headers?: Record<string, string> | Headers | undefined;
      body?: string | undefined;
      followRedirects?: boolean | undefined;
      skipCertificateVerification?: boolean | undefined;
    }>;
    conditions?:
      | Readonly<{
        bodyMustContain?: string | undefined;
        responseTimeWarningMillis?: number | undefined;
        responseTimeCriticalMillis?: number | undefined;
        responseTimeAverageOverDataPoints?: number | undefined;
        certificateExpirationWarningDays?: number | undefined;
        certificateExpirationCriticalDays?: number | undefined;
        numAttempts?: number | undefined;
      }>
      | undefined;
  }>;

export type CreateExpressionMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "expression";
    expression: string;
    conditions: Readonly<{
      operator: MonitorOperator;
      warning?: number | undefined;
      critical?: number | undefined;
    }>;
  }>;

export type CreateAnomalyDetectionMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "anomalyDetection";
    scopes: readonly string[];
    trainFrom?: Date | undefined;
    conditions: Readonly<{
      warning?: AnomalyDetectionMonitorSensitivity | undefined;
      critical?: AnomalyDetectionMonitorSensitivity | undefined;
      numAttempts?: number | undefined;
    }>;
  }>;

export type CreateQueryMonitorInput =
  & BaseCreateMonitorInput
  & Readonly<{
    type: "query";
    queryName: string;
    query: string;
    conditions: Readonly<{
      operator: MonitorOperator;
      warning?: number | undefined;
      critical?: number | undefined;
    }>;
  }>;

export class MonitorsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Monitor[]> {
    const res = await this.api.fetch<{ monitors: RawMonitor[] }>(
      "GET",
      "/api/v0/monitors/",
      { signal: options?.signal },
    );
    return res.monitors.map((monitor) => fromRawMonitor(monitor));
  }

  async get(monitorId: string, options?: ApiOptions): Promise<Monitor> {
    const res = await this.api.fetch<RawMonitor>(
      "GET",
      `/api/v0/monitors/${monitorId}`,
      { signal: options?.signal },
    );
    return fromRawMonitor(res);
  }

  async create(input: CreateMonitorInput, options?: ApiOptions): Promise<Monitor> {
    const res = await this.api.fetch<RawMonitor, RawCreateMonitorInput>(
      "POST",
      "/api/v0/monitors",
      {
        body: toRawCreateMonitorInput(input),
        signal: options?.signal,
      },
    );
    return fromRawMonitor(res);
  }

  async update(
    monitorId: string,
    input: CreateMonitorInput,
    options?: ApiOptions,
  ): Promise<Monitor> {
    const res = await this.api.fetch<RawMonitor, RawCreateMonitorInput>(
      "PUT",
      `/api/v0/monitors/${monitorId}`,
      {
        body: toRawCreateMonitorInput(input),
        signal: options?.signal,
      },
    );
    return fromRawMonitor(res);
  }

  async delete(monitorId: string, options?: ApiOptions): Promise<Monitor> {
    const res = await this.api.fetch<RawMonitor>(
      "DELETE",
      `/api/v0/monitors/${monitorId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawMonitor(res);
  }
}

type RawMonitor =
  | RawConnectivityMonitor
  | RawHostMonitor
  | RawServiceMonitor
  | RawExternalMonitor
  | RawExpressionMonitor
  | RawAnomalyDetectionMonitor
  | RawQueryMonitor;

type RawBaseMonitor = {
  id: string;
  name: string;
  memo?: string | null | undefined;
  notificationInterval?: number | null | undefined;
  isMute: boolean;
};

type RawConnectivityMonitor = RawBaseMonitor & {
  type: "connectivity";
  scopes: string[];
  excludeScopes: string[];
  alertStatusOnGone: ConnectivityMonitorAlertStatus;
};

type RawHostMonitor = RawBaseMonitor & {
  type: "host";
  metric: string;
  scopes: string[];
  excludeScopes: string[];
  operator: MonitorOperator;
  warning?: number | null | undefined;
  critical?: number | null | undefined;
  duration: number;
  maxCheckAttempts: number;
};

type RawServiceMonitor = RawBaseMonitor & {
  type: "service";
  service: string;
  metric: string;
  operator: MonitorOperator;
  warning?: number | null | undefined;
  critical?: number | null | undefined;
  duration: number;
  maxCheckAttempts: number;
  missingDurationWarning?: number | null | undefined;
  missingDurationCritical?: number | null | undefined;
};

type RawExternalMonitor = RawBaseMonitor & {
  type: "external";
  service?: string | null | undefined;
  url: string;
  method: ExternalMonitorHttpMethod;
  headers: Array<{ name: string; value: string }>;
  requestBody?: string | null | undefined;
  followRedirect?: boolean | null | undefined;
  skipCertificateVerification?: boolean | null | undefined;
  containsString?: string | null | undefined;
  responseTimeWarning?: number | null | undefined;
  responseTimeCritical?: number | null | undefined;
  responseTimeDuration?: number | null | undefined;
  certificationExpirationWarning?: number | null | undefined;
  certificationExpirationCritical?: number | null | undefined;
  maxCheckAttempts: number;
};

type RawExpressionMonitor = RawBaseMonitor & {
  type: "expression";
  expression: string;
  operator: MonitorOperator;
  warning?: number | null | undefined;
  critical?: number | null | undefined;
};

type RawAnomalyDetectionMonitor = RawBaseMonitor & {
  type: "anomalyDetection";
  scopes: string[];
  trainingPeriodFrom?: number | null | undefined;
  warningSensitivity?: AnomalyDetectionMonitorSensitivity | null | undefined;
  criticalSensitivity?: AnomalyDetectionMonitorSensitivity | null | undefined;
  maxCheckAttempts: number;
};

type RawQueryMonitor = RawBaseMonitor & {
  type: "query";
  legend: string;
  query: string;
  operator: MonitorOperator;
  warning?: number | null | undefined;
  critical?: number | null | undefined;
};

function fromRawMonitor(raw: RawMonitor): Monitor {
  const base: BaseMonitor = {
    id: raw.id,
    name: raw.name,
    memo: raw.memo ?? "",
    notificationIntervalMinutes: raw.notificationInterval ?? undefined,
    isMuted: raw.isMute,
  };
  switch (raw.type) {
    case "connectivity":
      return {
        ...base,
        type: "connectivity",
        scopes: {
          include: raw.scopes.length === 0 ? undefined : raw.scopes,
          exclude: raw.excludeScopes.length === 0 ? undefined : raw.excludeScopes,
        },
        alertStatus: raw.alertStatusOnGone,
      };
    case "host":
      return {
        ...base,
        type: "host",
        metricName: raw.metric,
        scopes: {
          include: raw.scopes.length === 0 ? undefined : raw.scopes,
          exclude: raw.excludeScopes.length === 0 ? undefined : raw.excludeScopes,
        },
        conditions: {
          operator: raw.operator,
          warning: raw.warning ?? undefined,
          critical: raw.critical ?? undefined,
          averageOverDataPoints: raw.duration,
          numAttempts: raw.maxCheckAttempts,
        },
      };
    case "service":
      return {
        ...base,
        type: "service",
        serviceName: raw.service,
        metricName: raw.metric,
        conditions: {
          operator: raw.operator,
          warning: raw.warning ?? undefined,
          critical: raw.critical ?? undefined,
          averageOverDataPoints: raw.duration,
          numAttempts: raw.maxCheckAttempts,
        },
        inactivityConditions: {
          warningMinutes: raw.missingDurationWarning ?? undefined,
          criticalMinutes: raw.missingDurationCritical ?? undefined,
        },
      };
    case "external":
      return {
        ...base,
        type: "external",
        serviceName: raw.service ?? undefined,
        request: {
          url: new URL(raw.url),
          method: raw.method,
          headers: new Headers(raw.headers.map(({ name, value }) => [name, value])),
          body: raw.requestBody ?? "",
          followRedirects: raw.followRedirect ?? false,
          skipCertificateVerification: raw.skipCertificateVerification ?? false,
        },
        conditions: {
          bodyMustContain: raw.containsString ?? undefined,
          responseTimeWarningMillis: raw.responseTimeWarning ?? undefined,
          responseTimeCriticalMillis: raw.responseTimeCritical ?? undefined,
          responseTimeAverageOverDataPoints: raw.responseTimeDuration ?? undefined,
          certificateExpirationWarningDays: raw.certificationExpirationWarning ?? undefined,
          certificateExpirationCriticalDays: raw.certificationExpirationCritical ?? undefined,
          numAttempts: raw.maxCheckAttempts,
        },
      };
    case "expression":
      return {
        ...base,
        type: "expression",
        expression: raw.expression,
        conditions: {
          operator: raw.operator,
          warning: raw.warning ?? undefined,
          critical: raw.critical ?? undefined,
        },
      };
    case "anomalyDetection":
      return {
        ...base,
        type: "anomalyDetection",
        scopes: raw.scopes,
        trainFrom: typeof raw.trainingPeriodFrom === "number"
          ? new Date(raw.trainingPeriodFrom * 1000)
          : undefined,
        conditions: {
          warning: raw.warningSensitivity ?? undefined,
          critical: raw.criticalSensitivity ?? undefined,
          numAttempts: raw.maxCheckAttempts,
        },
      };
    case "query":
      return {
        ...base,
        type: "query",
        queryName: raw.legend,
        query: raw.query,
        conditions: {
          operator: raw.operator,
          warning: raw.warning ?? undefined,
          critical: raw.critical ?? undefined,
        },
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown monitor type: ${type}`, { cause: raw });
    }
  }
}

type RawCreateMonitorInput =
  | RawCreateConnectivityMonitorInput
  | RawCreateHostMonitorInput
  | RawCreateServiceMonitorInput
  | RawCreateExternalMonitorInput
  | RawCreateExpressionMonitorInput
  | RawCreateAnomalyDetectionMonitorInput
  | RawCreateQueryMonitorInput;

type RawBaseCreateMonitorInput = {
  name: string;
  memo?: string | undefined;
  notificationInterval?: number | undefined;
  isMute?: boolean | undefined;
};

type RawCreateConnectivityMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "connectivity";
    scopes?: readonly string[] | undefined;
    excludeScopes?: readonly string[] | undefined;
    alertStatusOnGone?: "CRITICAL" | "WARNING" | undefined;
  }>;

type RawCreateHostMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "host";
    metric: string;
    scopes?: readonly string[] | undefined;
    excludeScopes?: readonly string[] | undefined;
    operator: MonitorOperator;
    warning?: number | undefined;
    critical?: number | undefined;
    duration: number;
    maxCheckAttempts?: number | undefined;
  }>;

type RawCreateServiceMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "service";
    service: string;
    metric: string;
    operator: MonitorOperator;
    warning?: number | undefined;
    critical?: number | undefined;
    duration: number;
    maxCheckAttempts?: number | undefined;
    missingDurationWarning?: number | undefined;
    missingDurationCritical?: number | undefined;
  }>;

type RawCreateExternalMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "external";
    service?: string | undefined;
    url: string;
    method?: ExternalMonitorHttpMethod | undefined;
    headers?:
      | ReadonlyArray<Readonly<{ name: string; value: string }>>
      | undefined;
    requestBody?: string | undefined;
    followRedirect?: boolean | undefined;
    skipCertificateVerification?: boolean | undefined;
    containsString?: string | undefined;
    responseTimeWarning?: number | undefined;
    responseTimeCritical?: number | undefined;
    responseTimeDuration?: number | undefined;
    certificationExpirationWarning?: number | undefined;
    certificationExpirationCritical?: number | undefined;
    maxCheckAttempts?: number | undefined;
  }>;

type RawCreateExpressionMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "expression";
    expression: string;
    operator: MonitorOperator;
    warning?: number | undefined;
    critical?: number | undefined;
  }>;

type RawCreateAnomalyDetectionMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "anomalyDetection";
    scopes: readonly string[];
    trainingPeriodFrom?: number | undefined;
    warningSensitivity?: AnomalyDetectionMonitorSensitivity | undefined;
    criticalSensitivity?: AnomalyDetectionMonitorSensitivity | undefined;
    maxCheckAttempts?: number | undefined;
  }>;

type RawCreateQueryMonitorInput =
  & RawBaseCreateMonitorInput
  & Readonly<{
    type: "query";
    legend: string;
    query: string;
    operator: MonitorOperator;
    warning?: number | undefined;
    critical?: number | undefined;
  }>;

function toRawCreateMonitorInput(
  input: CreateMonitorInput,
): RawCreateMonitorInput {
  const base: RawBaseCreateMonitorInput = {
    name: input.name,
    memo: input.memo,
    notificationInterval: input.notificationIntervalMinutes,
    isMute: input.isMuted,
  };
  switch (input.type) {
    case "connectivity":
      return {
        ...base,
        type: "connectivity",
        scopes: input.scopes?.include,
        excludeScopes: input.scopes?.exclude,
        alertStatusOnGone: input.alertStatus ?? "CRITICAL",
      };
    case "host":
      return {
        ...base,
        type: "host",
        metric: input.metricName,
        scopes: input.scopes?.include,
        excludeScopes: input.scopes?.exclude,
        operator: input.conditions.operator,
        warning: input.conditions.warning,
        critical: input.conditions.critical,
        duration: input.conditions.averageOverDataPoints ?? 1,
        maxCheckAttempts: input.conditions.numAttempts,
      };
    case "service":
      return {
        ...base,
        type: "service",
        service: input.serviceName,
        metric: input.metricName,
        operator: input.conditions.operator,
        warning: input.conditions.warning,
        critical: input.conditions.critical,
        duration: input.conditions.averageOverDataPoints ?? 1,
        maxCheckAttempts: input.conditions.numAttempts,
        missingDurationWarning: input.inactivityConditions?.warningMinutes,
        missingDurationCritical: input.inactivityConditions?.criticalMinutes,
      };
    case "external":
      return {
        ...base,
        type: "external",
        service: input.serviceName,
        url: input.request.url instanceof URL ? input.request.url.toString() : input.request.url,
        method: input.request.method,
        headers: input.request.headers instanceof Headers
          ? [...input.request.headers].map(([name, value]) => ({ name, value }))
          : input.request.headers
          ? Object.entries(input.request.headers).map(([name, value]) => ({ name, value }))
          : undefined,
        requestBody: input.request.body,
        // defaults to true as the web console does
        followRedirect: input.request.followRedirects ?? true,
        skipCertificateVerification: input.request.skipCertificateVerification,
        containsString: input.conditions?.bodyMustContain,
        responseTimeWarning: input.conditions?.responseTimeWarningMillis,
        responseTimeCritical: input.conditions?.responseTimeCriticalMillis,
        // required when responseTimeWarning or responseTimeCritical is set
        responseTimeDuration: input.conditions?.responseTimeAverageOverDataPoints ??
          (input.conditions?.responseTimeWarningMillis !== undefined ||
              input.conditions?.responseTimeCriticalMillis !== undefined
            ? 1
            : undefined),
        certificationExpirationWarning: input.conditions?.certificateExpirationWarningDays,
        certificationExpirationCritical: input.conditions?.certificateExpirationCriticalDays,
        maxCheckAttempts: input.conditions?.numAttempts,
      };
    case "expression":
      return {
        ...base,
        type: "expression",
        expression: input.expression,
        operator: input.conditions.operator,
        warning: input.conditions.warning,
        critical: input.conditions.critical,
      };
    case "anomalyDetection":
      return {
        ...base,
        type: "anomalyDetection",
        scopes: input.scopes,
        trainingPeriodFrom: input.trainFrom
          ? Math.floor(input.trainFrom.getTime() / 1000)
          : undefined,
        warningSensitivity: input.conditions.warning,
        criticalSensitivity: input.conditions.critical,
        maxCheckAttempts: input.conditions.numAttempts,
      };
    case "query":
      return {
        ...base,
        type: "query",
        legend: input.queryName,
        query: input.query,
        operator: input.conditions.operator,
        warning: input.conditions.warning,
        critical: input.conditions.critical,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (input satisfies never as any).type;
      throw new Error(`Unknown monitor type: ${type}`, { cause: input });
    }
  }
}
