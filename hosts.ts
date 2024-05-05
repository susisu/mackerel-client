import type { ApiClient, ApiOptions } from "./api.ts";
import type { AlertStatus } from "./alerts.ts";

export type Host = {
  id: string;
  createdAt: Date;
  name: string;
  displayName: string | undefined;
  customIdentifier: string | undefined;
  memo: string;
  meta: object;
  size: HostSize;
  status: HostStatus;
  isRetired: boolean;
  retiredAt: Date | undefined;
  interfaces: Interface[];
  roles: Record<string, string[]>;
};

export type Interface = {
  name: string;
  macAddress: string | undefined;
  ipv4Addresses: string[];
  ipv6Addresses: string[];
  ipAddress: string | undefined;
  ipv6Address: string | undefined;
};

export type HostSize = "standard" | "micro";

export type HostStatus = "working" | "standby" | "maintenance" | "poweroff";

export type CreateHostInput = Readonly<{
  name: string;
  displayName?: string | undefined;
  customIdentifier?: string | undefined;
  memo?: string | undefined;
  meta?: object | undefined;
  interfaces?: readonly CreateHostInputInterface[] | undefined;
  roleFullnames?: readonly string[] | undefined;
  checks?: readonly CreateHostInputCheckMonitor[] | undefined;
}>;

export type CreateHostInputInterface = Readonly<{
  name: string;
  macAddress?: string | undefined;
  ipv4Addresses?: readonly string[] | undefined;
  ipv6Addresses?: readonly string[] | undefined;
  ipAddress?: string | undefined;
  ipv6Address?: string | undefined;
}>;

export type CreateHostInputCheckMonitor = Readonly<{
  name: string;
  memo?: string | undefined;
}>;

export type MonitoredStatus = {
  monitorId: string;
  status: AlertStatus;
  detail: MonitoredStatusDetail | undefined;
};

export type MonitoredStatusDetail = {
  type: "check";
  message: string;
  memo: string | undefined;
};

export class HostsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(
    options?: ApiOptions<{
      serviceName: string;
      roleNames: readonly string[];
      name: string;
      customIdentifier: string;
      statuses: readonly HostStatus[];
    }>,
  ): Promise<Host[]> {
    const params = new URLSearchParams();
    if (options?.serviceName !== undefined) {
      params.set("service", options.serviceName);
    }
    if (options?.roleNames) {
      for (const roleName of options.roleNames) {
        params.append("role", roleName);
      }
    }
    if (options?.name !== undefined) {
      params.append("role", options.name);
    }
    if (options?.customIdentifier !== undefined) {
      params.append("role", options.customIdentifier);
    }
    if (options?.statuses) {
      for (const status of options.statuses) {
        params.append("status", status);
      }
    }
    const res = await this.api.fetch<{ hosts: RawHost[] }>(
      "GET",
      "/api/v0/hosts",
      {
        params,
        signal: options?.signal,
      },
    );
    return res.hosts.map((host) => fromRawHost(host));
  }

  async get(
    hostId: string,
    options?: ApiOptions,
  ): Promise<Host> {
    const res = await this.api.fetch<{ host: RawHost }>(
      "GET",
      `/api/v0/hosts/${hostId}`,
      { signal: options?.signal },
    );
    return fromRawHost(res.host);
  }

  async getByCustomIdentifier(
    customIdentifier: string,
    options?: ApiOptions<{
      caseInsensitive: boolean;
    }>,
  ): Promise<Host> {
    const params = new URLSearchParams();
    if (options?.caseInsensitive) {
      params.set("caseInsensitive", "true");
    }
    const res = await this.api.fetch<{ host: RawHost }>(
      "GET",
      `/api/v0/hosts-by-custom-identifier/${customIdentifier}`,
      {
        params,
        signal: options?.signal,
      },
    );
    return fromRawHost(res.host);
  }

  async create(
    input: CreateHostInput,
    options?: ApiOptions,
  ): Promise<{ id: string }> {
    const res = await this.api.fetch<{ id: string }, RawCreateHostInput>(
      "POST",
      "/api/v0/hosts",
      {
        body: toRawCreateHostInput(input),
        signal: options?.signal,
      },
    );
    return res;
  }

  async update(
    hostId: string,
    input: CreateHostInput,
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<unknown, RawCreateHostInput>(
      "PUT",
      `/api/v0/hosts/${hostId}`,
      {
        body: toRawCreateHostInput(input),
        signal: options?.signal,
      },
    );
  }

  async updateStatus(
    hostId: string,
    status: HostStatus,
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<unknown, Readonly<{ status: HostStatus }>>(
      "POST",
      `/api/v0/hosts/${hostId}/status`,
      {
        body: { status },
        signal: options?.signal,
      },
    );
  }

  async bulkUpdateStatuses(
    hostIds: readonly string[],
    status: HostStatus,
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<
      unknown,
      Readonly<{
        ids: readonly string[];
        status: HostStatus;
      }>
    >(
      "POST",
      "/api/v0/hosts/bulk-update-statuses",
      {
        body: {
          ids: hostIds,
          status: status,
        },
        signal: options?.signal,
      },
    );
  }

  async updateRoles(
    hostId: string,
    roleFullnames: readonly string[],
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<
      unknown,
      Readonly<{ roleFullnames: readonly string[] }>
    >(
      "PUT",
      `/api/v0/hosts/${hostId}/role-fullnames`,
      {
        body: { roleFullnames },
        signal: options?.signal,
      },
    );
  }

  async retire(
    hostId: string,
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<unknown>(
      "POST",
      `/api/v0/hosts/${hostId}/retire`,
      {
        body: {},
        signal: options?.signal,
      },
    );
  }

  async bulkRetire(
    hostIds: readonly string[],
    options?: ApiOptions,
  ): Promise<void> {
    await this.api.fetch<unknown, Readonly<{ ids: readonly string[] }>>(
      "POST",
      "/api/v0/hosts/bulk-retire",
      {
        body: { ids: hostIds },
        signal: options?.signal,
      },
    );
  }

  async listMetricNames(
    hostId: string,
    options?: ApiOptions,
  ): Promise<string[]> {
    const res = await this.api.fetch<{ names: string[] }>(
      "GET",
      `/api/v0/hosts/${hostId}/metric-names`,
      { signal: options?.signal },
    );
    return res.names;
  }

  async listMonitoredStatuses(
    hostId: string,
    options?: ApiOptions,
  ): Promise<MonitoredStatus[]> {
    type RawMonitoredStatus = {
      monitorId: string;
      status: AlertStatus;
      detail?: RawMonitoredStatusDetail | null | undefined;
    };
    type RawMonitoredStatusDetail = {
      type: "check";
      message: string;
      memo?: string | null | undefined;
    };
    const res = await this.api.fetch<
      { monitoredStatuses: RawMonitoredStatus[] }
    >(
      "GET",
      `/api/v0/hosts/${hostId}/monitored-statuses`,
      { signal: options?.signal },
    );
    return res.monitoredStatuses.map((ms) => ({
      monitorId: ms.monitorId,
      status: ms.status,
      detail: ms.detail
        ? {
          type: ms.detail.type,
          message: ms.detail.message,
          memo: ms.detail.memo ?? undefined,
        }
        : undefined,
    }));
  }
}

type RawHost = {
  id: string;
  createdAt: number;
  name: string;
  displayName?: string | null | undefined;
  customIdentifier?: string | null | undefined;
  memo: string;
  meta: object;
  size: HostSize;
  status: HostStatus;
  isRetired: boolean;
  retiredAt?: number | null | undefined;
  interfaces: RawInterface[];
  roles: Record<string, string[]>;
};

type RawInterface = {
  name: string;
  macAddress?: string | null | undefined;
  ipv4Addresses: string[];
  ipv6Addresses: string[];
  ipAddress?: string | null | undefined;
  ipv6Address?: string | null | undefined;
};

function fromRawHost(raw: RawHost): Host {
  return {
    id: raw.id,
    createdAt: new Date(raw.createdAt * 1000),
    name: raw.name,
    displayName: raw.displayName ?? undefined,
    customIdentifier: raw.customIdentifier ?? undefined,
    memo: raw.memo,
    meta: raw.meta,
    size: raw.size,
    status: raw.status,
    isRetired: raw.isRetired,
    retiredAt: typeof raw.retiredAt === "number"
      ? new Date(raw.retiredAt * 1000)
      : undefined,
    interfaces: raw.interfaces.map((iface) => ({
      name: iface.name,
      macAddress: iface.macAddress ?? undefined,
      ipv4Addresses: iface.ipv4Addresses,
      ipv6Addresses: iface.ipv6Addresses,
      ipAddress: iface.ipAddress ?? undefined,
      ipv6Address: iface.ipv6Address ?? undefined,
    })),
    roles: raw.roles,
  };
}

type RawCreateHostInput = Readonly<{
  name: string;
  displayName?: string | undefined;
  customIdentifier?: string | undefined;
  memo?: string | undefined;
  meta: object;
  interfaces?: readonly CreateHostInputInterface[] | undefined;
  roleFullnames?: readonly string[] | undefined;
  checks?: readonly CreateHostInputCheckMonitor[] | undefined;
}>;

function toRawCreateHostInput(input: CreateHostInput): RawCreateHostInput {
  return {
    name: input.name,
    displayName: input.displayName,
    customIdentifier: input.customIdentifier,
    memo: input.memo,
    meta: input.meta ?? {},
    interfaces: input.interfaces,
    roleFullnames: input.roleFullnames,
    checks: input.checks,
  };
}
