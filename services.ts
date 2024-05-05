import { ApiClient } from "./api.ts";

export type Service = {
  name: string;
  memo: string;
  roles: string[];
};

export type CreateServiceInput = {
  name: string;
  memo?: string | undefined;
};

export type Role = {
  name: string;
  memo: string;
};

export type CreateRoleInput = {
  name: string;
  memo?: string | undefined;
};

export class ServicesApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(
    options?: { signal?: AbortSignal | undefined },
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
    options?: { signal?: AbortSignal | undefined },
  ): Promise<Service> {
    type RawInput = {
      name: string;
      memo: string;
    };
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
    options?: { signal?: AbortSignal | undefined },
  ): Promise<Service> {
    const res = await this.api.fetch<Service>(
      "DELETE",
      `/api/v0/services/${serviceName}`,
      { signal: options?.signal },
    );
    return res;
  }

  async listRoles(
    serviceName: string,
    options?: { signal?: AbortSignal | undefined },
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
    options?: { signal?: AbortSignal | undefined },
  ): Promise<Role> {
    type RawInput = {
      name: string;
      memo: string;
    };
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
    options?: { signal?: AbortSignal | undefined },
  ): Promise<Role> {
    const res = await this.api.fetch<Role>(
      "DELETE",
      `/api/v0/services/${serviceName}/roles/${roleName}`,
      { signal: options?.signal },
    );
    return res;
  }

  async listMetricNames(
    serviceName: string,
    options?: { signal?: AbortSignal | undefined },
  ): Promise<string[]> {
    const res = await this.api.fetch<{ names: string[] }>(
      "GET",
      `/api/v0/services/${serviceName}/metric-names`,
      { signal: options?.signal },
    );
    return res.names;
  }
}
