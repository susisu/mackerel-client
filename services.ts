import type { ApiClient, ApiOptions } from "./api.ts";

export type Service = {
  name: string;
  memo: string;
  roles: string[];
};

export type CreateServiceInput = Readonly<{
  name: string;
  memo?: string | undefined;
}>;

export type Role = {
  name: string;
  memo: string;
};

export type CreateRoleInput = Readonly<{
  name: string;
  memo?: string | undefined;
}>;

export class ServicesApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(
    options?: ApiOptions,
  ): Promise<Service[]> {
    const res = await this.api.fetch<{ services: Service[] }>(
      "GET",
      "/api/v0/services",
      { signal: options?.signal },
    );
    return res.services;
  }

  async create(
    input: CreateServiceInput,
    options?: ApiOptions,
  ): Promise<Service> {
    type RawInput = Readonly<{
      name: string;
      memo: string;
    }>;
    const res = await this.api.fetch<Service, RawInput>(
      "POST",
      "/api/v0/services",
      {
        body: {
          name: input.name,
          memo: input.memo ?? "",
        },
        signal: options?.signal,
      },
    );
    return res;
  }

  async delete(
    serviceName: string,
    options?: ApiOptions,
  ): Promise<Service> {
    // deno-lint-ignore ban-types
    const res = await this.api.fetch<Service, {}>(
      "DELETE",
      `/api/v0/services/${serviceName}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return res;
  }

  async listRoles(
    serviceName: string,
    options?: ApiOptions,
  ): Promise<Role[]> {
    const res = await this.api.fetch<{ roles: Role[] }>(
      "GET",
      `/api/v0/services/${serviceName}/roles`,
      { signal: options?.signal },
    );
    return res.roles;
  }

  async createRole(
    serviceName: string,
    input: CreateRoleInput,
    options?: ApiOptions,
  ): Promise<Role> {
    type RawInput = Readonly<{
      name: string;
      memo: string;
    }>;
    const res = await this.api.fetch<Role, RawInput>(
      "POST",
      `/api/v0/services/${serviceName}/roles`,
      {
        body: {
          name: input.name,
          memo: input.memo ?? "",
        },
        signal: options?.signal,
      },
    );
    return res;
  }

  async deleteRole(
    serviceName: string,
    roleName: string,
    options?: ApiOptions,
  ): Promise<Role> {
    // deno-lint-ignore ban-types
    const res = await this.api.fetch<Role, {}>(
      "DELETE",
      `/api/v0/services/${serviceName}/roles/${roleName}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return res;
  }

  async listMetricNames(
    serviceName: string,
    options?: ApiOptions,
  ): Promise<string[]> {
    const res = await this.api.fetch<{ names: string[] }>(
      "GET",
      `/api/v0/services/${serviceName}/metric-names`,
      { signal: options?.signal },
    );
    return res.names;
  }
}
