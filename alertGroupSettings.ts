import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiClient, ApiOptions } from "./api.ts";

assertType<Extends<AlertGroupSetting, CreateAlertGroupSettingInput>>(true);

export type AlertGroupSetting = {
  id: string;
  name: string;
  memo: string;
  scopes: {
    services: string[] | undefined;
    roles: string[] | undefined;
    monitors: string[] | undefined;
  };
  notificationIntervalMinutes: number | undefined;
};

export type CreateAlertGroupSettingInput = Readonly<{
  name: string;
  memo?: string | undefined;
  scopes?:
    | Readonly<{
      services?: readonly string[] | undefined;
      roles?: readonly string[] | undefined;
      monitors?: readonly string[] | undefined;
    }>
    | undefined;
  notificationIntervalMinutes?: number | undefined;
}>;

export class AlertGroupSettingsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<AlertGroupSetting[]> {
    const res = await this.api.fetch<{ alertGroupSettings: RawAlertGroupSetting[] }>(
      "GET",
      "/api/v0/alert-group-settings",
      { signal: options?.signal },
    );
    return res.alertGroupSettings.map((setting) => fromRawAlertGroupSetting(setting));
  }

  async get(settingId: string, options?: ApiOptions): Promise<AlertGroupSetting> {
    const res = await this.api.fetch<RawAlertGroupSetting>(
      "GET",
      `/api/v0/alert-group-settings/${settingId}`,
      { signal: options?.signal },
    );
    return fromRawAlertGroupSetting(res);
  }

  async create(
    input: CreateAlertGroupSettingInput,
    options?: ApiOptions,
  ): Promise<AlertGroupSetting> {
    const res = await this.api.fetch<RawAlertGroupSetting, RawCreateAlertGroupSettingInput>(
      "POST",
      "/api/v0/alert-group-settings",
      {
        body: toRawCreateAlertGroupSettingInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }

  async update(
    settingId: string,
    input: CreateAlertGroupSettingInput,
    options?: ApiOptions,
  ): Promise<AlertGroupSetting> {
    const res = await this.api.fetch<RawAlertGroupSetting, RawCreateAlertGroupSettingInput>(
      "PUT",
      `/api/v0/alert-group-settings/${settingId}`,
      {
        body: toRawCreateAlertGroupSettingInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }

  async delete(settingId: string, options?: ApiOptions): Promise<AlertGroupSetting> {
    const res = await this.api.fetch<RawAlertGroupSetting>(
      "DELETE",
      `/api/v0/alert-group-settings/${settingId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }
}

type RawAlertGroupSetting = {
  id: string;
  name: string;
  memo?: string | null | undefined;
  serviceScopes?: string[] | null | undefined;
  roleScopes?: string[] | null | undefined;
  monitorScopes?: string[] | null | undefined;
  notificationInterval?: number | null | undefined;
};

function fromRawAlertGroupSetting(raw: RawAlertGroupSetting): AlertGroupSetting {
  return {
    id: raw.id,
    name: raw.name,
    memo: raw.memo ?? "",
    scopes: {
      services: raw.serviceScopes && raw.serviceScopes.length > 0 ? raw.serviceScopes : undefined,
      roles: raw.roleScopes && raw.roleScopes.length > 0 ? raw.roleScopes : undefined,
      monitors: raw.monitorScopes && raw.monitorScopes.length > 0 ? raw.monitorScopes : undefined,
    },
    notificationIntervalMinutes: raw.notificationInterval ?? undefined,
  };
}

type RawCreateAlertGroupSettingInput = Readonly<{
  name: string;
  memo?: string | undefined;
  serviceScopes?: readonly string[] | undefined;
  roleScopes?: readonly string[] | undefined;
  monitorScopes?: readonly string[] | undefined;
  notificationInterval?: number | undefined;
}>;

function toRawCreateAlertGroupSettingInput(
  input: CreateAlertGroupSettingInput,
): RawCreateAlertGroupSettingInput {
  return {
    name: input.name,
    memo: input.memo,
    serviceScopes: input.scopes?.services,
    roleScopes: input.scopes?.roles,
    monitorScopes: input.scopes?.monitors,
    notificationInterval: input.notificationIntervalMinutes,
  };
}
