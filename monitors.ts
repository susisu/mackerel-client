import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";
import type { AlertStatus } from "./alerts.ts";

assertType<Extends<Monitor, CreateMonitorInput>>(true);

export type Monitor =
  | ConnectivityMonitor
  | HostMonitor
  | ServiceMonitor
  | ExternalMonitor
  | ExpressionMonitor
  | AnomalyDetectionMonitor
  | QueryMonitor;

export type BaseMonitor = {
  id: string;
  name: string;
  memo: string;
  notificationIntervalMinutes: number | undefined;
  isMuted: boolean;
};

export type ConnectivityMonitor = BaseMonitor & {
  type: "connectivity";
  scopes: {
    /** included service names or role fullnames */
    include: string[];
    /** excluded service names or role fullnames */
    exclude: string[];
  };
  alertStatus: ConnectivityMonitorAlertStatus;
};

export type HostMonitor = BaseMonitor & {
  type: "host";
  metricName: string;
  scopes: {
    /** included service names or role fullnames */
    include: string[];
    /** excluded service names or role fullnames */
    exclude: string[];
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
    url: string;
    method: ExternalMonitorHttpMethod;
    headers: ExternalMonitorHeader[];
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
  query: string;
  legend: string;
  conditions: Readonly<{
    operator: MonitorOperator;
    warning: number | undefined;
    critical: number | undefined;
  }>;
};

export type MonitorOperator = ">" | "<";

export type ConnectivityMonitorAlertStatus = "CRITICAL" | "WARNING";

export type ExternalMonitorHttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ExternalMonitorHeader = [name: string, value: string];

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

export type BaseCreateMonitorInput = Readonly<{
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
      /** included service names or role fullnames */
      include?: readonly string[] | undefined;
      /** excluded service names or role fullnames */
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
      /** included service names or role fullnames */
      include?: readonly string[] | undefined;
      /** excluded service names or role fullnames */
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
      /** `[ { name, value } ]`, `{ name: value }` or `Headers` object */
      headers?:
        | readonly CreateExternalMonitorInputHeader[]
        | Headers
        | undefined;
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
    query: string;
    legend: string;
    conditions: Readonly<{
      operator: MonitorOperator;
      warning?: number | undefined;
      critical?: number | undefined;
    }>;
  }>;

export type CreateExternalMonitorInputHeader = readonly [name: string, value: string];

export type CheckMonitoringReport = Readonly<{
  name: string;
  source: CheckMonitoringReportSource;
  status: AlertStatus;
  message: string;
  occurredAt: Date;
  maxAttempts?: number | undefined;
  notificationIntervalMinutes?: number | undefined;
}>;

export type CheckMonitoringReportSource = Readonly<{
  type: "host";
  hostId: string;
}>;

export class MonitorsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<Monitor[]> {
    const res = await this.fetcher.fetch<{ monitors: RawMonitor[] }>(
      "GET",
      "/api/v0/monitors",
      { signal: options?.signal },
    );
    return res.monitors.map((monitor) => fromRawMonitor(monitor));
  }

  async get(monitorId: string, options?: ApiOptions): Promise<Monitor> {
    const res = await this.fetcher.fetch<{ monitor: RawMonitor }>(
      "GET",
      `/api/v0/monitors/${monitorId}`,
      { signal: options?.signal },
    );
    return fromRawMonitor(res.monitor);
  }

  async create(input: CreateMonitorInput, options?: ApiOptions): Promise<Monitor> {
    const res = await this.fetcher.fetch<RawMonitor, RawCreateMonitorInput>(
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
    const res = await this.fetcher.fetch<RawMonitor, RawCreateMonitorInput>(
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
    const res = await this.fetcher.fetch<RawMonitor>(
      "DELETE",
      `/api/v0/monitors/${monitorId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawMonitor(res);
  }

  async postCheckMonitoringReports(
    reports: readonly CheckMonitoringReport[],
    options?: ApiOptions,
  ): Promise<void> {
    type RawInput = Readonly<{
      reports: readonly RawReport[];
    }>;
    type RawReport = Readonly<{
      name: string;
      source: CheckMonitoringReportSource;
      status: AlertStatus;
      message: string;
      occurredAt: number;
      maxCheckAttempts?: number | undefined;
      notificationInterval?: number | undefined;
    }>;
    await this.fetcher.fetch<unknown, RawInput>(
      "POST",
      "/api/v0/monitoring/checks/report",
      {
        body: {
          reports: reports.map((report) => ({
            name: report.name,
            source: report.source,
            status: report.status,
            message: report.message,
            occurredAt: Math.floor(report.occurredAt.getTime() / 1000),
            maxCheckAttempts: report.maxAttempts,
            notificationInterval: report.notificationIntervalMinutes,
          })),
        },
        signal: options?.signal,
      },
    );
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
          include: raw.scopes,
          exclude: raw.excludeScopes,
        },
        alertStatus: raw.alertStatusOnGone,
      };
    case "host":
      return {
        ...base,
        type: "host",
        metricName: raw.metric,
        scopes: {
          include: raw.scopes,
          exclude: raw.excludeScopes,
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
          url: raw.url,
          method: raw.method,
          headers: raw.headers.map((header) => [header.name, header.value]),
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
        query: raw.query,
        legend: raw.legend,
        conditions: {
          operator: raw.operator,
          warning: raw.warning ?? undefined,
          critical: raw.critical ?? undefined,
        },
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any)?.type;
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
    alertStatusOnGone?: ConnectivityMonitorAlertStatus | undefined;
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
          ? input.request.headers.map(([name, value]) => ({ name, value }))
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
        query: input.query,
        legend: input.legend,
        operator: input.conditions.operator,
        warning: input.conditions.warning,
        critical: input.conditions.critical,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (input satisfies never as any)?.type;
      throw new Error(`Unknown monitor type: ${type}`, { cause: input });
    }
  }
}
